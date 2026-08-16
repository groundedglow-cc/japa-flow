import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import ffmpeg from "ffmpeg-static";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";

loadEnv();

const args = parseArgs(process.argv.slice(2));
const lessonNo = positiveInteger(args.lesson || args.lessonId || "", "lesson");
const autoApprove = args.autoApprove === true || args["auto-approve"] === true;
const reuseExistingAsr = args.reuseExistingAsr === true || args["reuse-existing-asr"] === true;
const root = process.cwd();
const inputPath = join(root, "data", "ocr", `lesson${lessonNo}-vocabulary.json`);
const outputPath = join(root, "data", "ocr", `lesson${lessonNo}-vocabulary-audio-verified.json`);
const cacheDir = join(root, "data", "ocr", "audio-cache", `lesson${lessonNo}`);
const sourceData = readJson(inputPath);
const existingOutput = reuseExistingAsr ? readExistingOutput(outputPath) : null;
const speechKey = process.env.AZURE_SPEECH_KEY;
const speechRegion = normalizeRegion(process.env.AZURE_SPEECH_REGION);
const lowMatchScoreThreshold = 0.65;
const autoApproveScoreThreshold = 0.82;
const neighborSilence = 0.02;
const shortHighScoreBackfillGap = 0.16;
const maxAutoApproveExpansion = 0.18;
const vadNoiseThreshold = "-35dB";
const vadMinimumSilence = 0.18;
const vadInternalPause = 0.3;
const vadStartPadding = 0.25;
const vadEndPadding = 0.12;
const vadBoundaryGap = 0.02;
const vadMinimumAnchorRatio = 0.65;
const vadSkipRegionCost = 0.7;
const vadMaximumExtraRegions = 3;
const vadAnchorDistanceScale = 0.55;

if (!reuseExistingAsr && (!speechKey || !speechRegion)) {
  throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION.");
}

const track = vocabularyItems(sourceData);

if (!track.length) {
  throw new Error(`No vocabulary items found in ${inputPath}.`);
}

const output = {
  schemaVersion: 1,
  lessonId: `lesson${lessonNo}`,
  generatedAt: new Date().toISOString(),
  method: "audio-vad-sequential-alignment-with-azure-verification",
  reviewStatus: "pending",
  tracks: []
};

const audioPath = await cachedAudioPath(`lesson${lessonNo}`, "lesson_words.mp3");
const transcription = reuseExistingAsr ? null : await transcribe(audioPath, speechKey, speechRegion, track);
const words = normalizeWords(transcription?.phrases || []);
const assignments = reuseExistingAsr
  ? reuseAssignments(track, existingOutput)
  : alignItems(track, words);
const speechTimingPlan = detectSequentialSpeechTiming(audioPath, track, assignments);
const reviewAt = new Date().toISOString();

const segments = assignments.map((assignment, index) => segmentFromAssignment(
  assignment,
  index,
  assignments,
  speechTimingPlan.items[index] || null,
  reviewAt
));
output.reviewStatus = reviewStatusForSegments(segments);

segments.forEach((segment, index) => {
  track[index].audioSegment = segment;
});

const warnings = [];
const lowConfidence = segments.filter((segment) => segment.matchScore < lowMatchScoreThreshold);
const pendingReview = segments.filter((segment) => segment.review?.status !== "approved");
if (lowConfidence.length) {
  warnings.push(`${lowConfidence.length} item(s) aligned with low ASR similarity.`);
}
if (pendingReview.length) {
  warnings.push(`${pendingReview.length} item(s) require manual verification before they should be treated as verified.`);
}
warnings.push(speechTimingPlan.note);

output.tracks.push({
  trackId: "lesson_words",
  sourceUrl: textbookAudioUrl(lessonNo, "lesson_words.mp3"),
  outputPath: relativeToRoot(outputPath),
  sourceAudioSha256: sha256(audioPath),
  duration: round(speechTimingPlan.duration || words.at(-1)?.end || 0),
  expectedItems: track.length,
  detectedWordCount: reuseExistingAsr
    ? Number(existingOutput.audioAlignment?.tracks?.[0]?.detectedWordCount || assignments.reduce((total, assignment) => total + assignment.words.length, 0))
    : words.length,
  alignedItems: segments.length,
  warnings,
  provider: "azure-speech-sdk-continuous-recognition"
});

const verified = { ...sourceData, vocabulary: sourceData.vocabulary.map((word, index) => ({ ...word, audioSegment: segments[index] })) };
verified.audioAlignment = output;
writeJson(outputPath, verified);

process.stdout.write(`${JSON.stringify({
  lessonId: output.lessonId,
  outputPath: relativeToRoot(outputPath),
  track: output.tracks[0]
}, null, 2)}\n`);

function vocabularyItems(data) {
  return (data.vocabulary || []).map((word, index) => ({
    id: word.id || `lesson${lessonNo}-word-${index + 1}`,
    index,
    kana: word.kana || "",
    writing: word.writing || "",
    rawText: word.rawText || "",
    label: word.writing || word.kana || word.id || ""
  }));
}

function readExistingOutput(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Cannot reuse ASR: missing existing alignment output ${relativeToRoot(filePath)}.`);
  }
  return readJson(filePath);
}

function reuseAssignments(items, existing) {
  const existingWords = existing?.vocabulary || [];
  if (existingWords.length !== items.length) {
    throw new Error(`Cannot reuse ASR: existing output has ${existingWords.length} item(s), expected ${items.length}.`);
  }
  return items.map((item, itemIndex) => {
    const segment = existingWords[itemIndex]?.audioSegment;
    const rawTiming = segment?.rawAzureTiming;
    const start = Number(rawTiming?.start ?? segment?.start);
    const end = Number(rawTiming?.end ?? segment?.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      throw new Error(`Cannot reuse ASR: ${item.id} has no valid Azure timing.`);
    }
    const indexes = Array.isArray(segment.wordIndexes) ? segment.wordIndexes : [];
    const words = String(segment.asrText || "").split(/\s+/).filter(Boolean).map((text, index) => ({
      text,
      index: Number(indexes[index] || index + 1)
    }));
    return {
      item,
      words,
      start,
      end,
      score: Number(segment.matchScore || 0)
    };
  });
}

function segmentFromAssignment(assignment, index, allAssignments, speechTiming, reviewAt) {
  const previous = allAssignments[index - 1] || null;
  const next = allAssignments[index + 1] || null;
  const rawStart = assignment.start;
  const rawEnd = assignment.end;
  const rawDuration = Math.max(0, rawEnd - rawStart);
  const minDuration = minimumSegmentDuration(assignment.item);
  const issues = [];
  const warnings = [];
  let start;
  let end;

  if (speechTiming) {
    start = speechTiming.paddedStart;
    end = speechTiming.paddedEnd;
    const overlap = intervalOverlap(rawStart, rawEnd, speechTiming.start, speechTiming.end);
    if (overlap <= 0) warnings.push("azure-timing-does-not-overlap-vad");
    if (assignment.score < lowMatchScoreThreshold) warnings.push(`low-asr-text-match:${round(assignment.score)}`);
  } else {
    start = Math.max(0, rawStart - 0.04);
    end = rawEnd + 0.06;

    if (assignment.score >= autoApproveScoreThreshold && rawDuration < minDuration) {
      const backfilledStart = Math.max(
        0,
        previous ? previous.end + shortHighScoreBackfillGap : 0,
        rawEnd - minDuration
      );
      if (backfilledStart < start) {
        start = backfilledStart;
        issues.push(`expanded-start:${round(rawStart - backfilledStart)}s`);
      }
    }

    if (previous) start = Math.max(start, previous.end + neighborSilence);
    if (next) end = Math.min(end, next.start - neighborSilence);
  }
  if (end <= start) {
    end = Math.max(start + 0.12, rawEnd);
    issues.push("neighbor-boundary-too-tight");
  }

  const roundedStart = round(Math.max(0, start));
  const roundedEnd = round(Math.max(roundedStart, end));
  const duration = round(Math.max(0, roundedEnd - roundedStart));
  const matchScore = round(assignment.score);
  const asrText = assignment.words.map((word) => word.text).join(" ");
  const review = reviewForSegment({
    autoApprove,
    reviewAt,
    matchScore,
    rawDuration,
    duration,
    minDuration,
    issues,
    asrText,
    reliableTiming: Boolean(speechTiming)
  });

  return {
    id: assignment.item.id,
    trackId: "lesson_words",
    sourceUrl: textbookAudioUrl(lessonNo, "lesson_words.mp3"),
    itemIndex: index + 1,
    text: assignment.item.kana || assignment.item.writing || assignment.item.rawText || "",
    label: assignment.item.writing || assignment.item.kana || assignment.item.id || "",
    start: roundedStart,
    end: roundedEnd,
    duration,
    speechUnitCount: assignment.words.length,
    wordCount: assignment.words.length,
    matchScore,
    asrText,
    wordIndexes: assignment.words.map((word) => word.index),
    method: speechTiming
      ? "audio-vad-sequential-alignment-with-azure-verification"
      : issues.length ? "azure-speech-word-alignment-adjusted" : "azure-speech-word-alignment",
    timingSource: speechTiming ? "audio-silence-detection" : "azure-speech-word-timestamp",
    timingConfidence: speechTiming ? "high" : review.status === "approved" ? scoreToConfidence(assignment.score) : "needs-review",
    confidence: review.status === "approved" ? (speechTiming ? "high" : scoreToConfidence(assignment.score)) : "needs-review",
    alignmentIssues: issues,
    alignmentWarnings: warnings,
    speechActivity: speechTiming ? {
      start: round(speechTiming.start),
      end: round(speechTiming.end),
      activeDuration: round(speechTiming.activeDuration),
      regionCount: speechTiming.regions.length
    } : null,
    rawAzureTiming: {
      start: round(rawStart),
      end: round(rawEnd),
      duration: round(rawDuration)
    },
    review
  };
}

function reviewForSegment({ autoApprove, reviewAt, matchScore, rawDuration, duration, minDuration, issues, asrText, reliableTiming }) {
  const reviewIssues = [...issues];
  if (!reliableTiming) {
    if (matchScore < lowMatchScoreThreshold) reviewIssues.push(`low-match-score:${matchScore}`);
    if (duration < 0.35) reviewIssues.push(`very-short-duration:${duration}s`);
    if (rawDuration < Math.min(minDuration, 0.6)) reviewIssues.push(`short-azure-timing:${round(rawDuration)}s`);
  }

  const expanded = issues.some((issue) => issue.startsWith("expanded-start:"));
  const expandedBy = expanded ? Number(issues.find((issue) => issue.startsWith("expanded-start:"))?.match(/:([0-9.]+)s/)?.[1] || 0) : 0;
  if (expandedBy > maxAutoApproveExpansion) reviewIssues.push(`large-heuristic-expansion:${round(expandedBy)}s`);

  const approved = autoApprove
    && reviewIssues.length === 0
    && (reliableTiming || matchScore >= autoApproveScoreThreshold);
  return {
    status: approved ? "approved" : "pending",
    severity: reviewIssues.length ? "risk" : approved ? "ok" : "pending",
    reviewedAt: approved ? reviewAt : null,
    note: approved
      ? "Automatically approved by the audio-boundary alignment workflow."
      : `Pending manual verification: ${reviewIssues.join("; ") || "auto-approval-disabled"}.`,
    matchScore,
    asrText
  };
}

function detectSequentialSpeechTiming(audioPath, items, assignments) {
  const detected = detectSpeechRegions(audioPath);
  const expectedCount = items.reduce((total, item) => total + expectedUtteranceCount(item), 0);
  const regions = mergeInternalSpeechPauses(detected.regions, expectedCount);
  const slots = speechSlots(items);

  if (regions.length < expectedCount || regions.length - expectedCount > vadMaximumExtraRegions) {
    return {
      items: Array(items.length).fill(null),
      duration: detected.duration,
      note: `Audio VAD found ${regions.length} speech region(s) for ${expectedCount} expected utterance(s); Azure timestamps were used as a fallback.`
    };
  }

  const alignment = regions.length === expectedCount
    ? directSpeechRegionAlignment(slots, regions)
    : alignSpeechRegionsToSlots(slots, regions, assignments);
  if (!alignment) {
    return {
      items: Array(items.length).fill(null),
      duration: detected.duration,
      note: `Audio VAD could not safely align ${regions.length} speech region(s) to ${expectedCount} expected utterance(s); Azure timestamps were used as a fallback.`
    };
  }

  const timings = withSpeechPlaybackBounds(
    itemTimingsFromSpeechSlots(items, slots, alignment.regionIndexes, regions)
  );

  const anchorMatches = timings.filter((timing, index) => {
    const assignment = assignments[index];
    return assignment && intervalOverlap(assignment.start, assignment.end, timing.start, timing.end) > 0;
  }).length;
  const anchorRatio = items.length ? anchorMatches / items.length : 0;
  if (anchorRatio < vadMinimumAnchorRatio) {
    return {
      items: Array(items.length).fill(null),
      duration: detected.duration,
      note: `Audio VAD sequence matched only ${anchorMatches}/${items.length} Azure timing anchors; Azure timestamps were used as a fallback.`
    };
  }

  return {
    items: timings,
    duration: detected.duration,
    note: `Audio VAD mapped ${regions.length} speech region(s) to ${items.length} vocabulary item(s)${alignment.skippedRegionIndexes.length ? ` after skipping ${alignment.skippedRegionIndexes.length} unmatched region(s)` : ""}, confirmed by ${anchorMatches}/${items.length} Azure timing anchors.`
  };
}

function speechSlots(items) {
  return items.flatMap((item, itemIndex) => Array.from(
    { length: expectedUtteranceCount(item) },
    () => ({ itemIndex })
  ));
}

function directSpeechRegionAlignment(slots, regions) {
  return {
    regionIndexes: slots.map((_slot, index) => index),
    skippedRegionIndexes: []
  };
}

function alignSpeechRegionsToSlots(slots, regions, assignments) {
  const rows = slots.length + 1;
  const columns = regions.length + 1;
  const costs = Array.from({ length: rows }, () => Array(columns).fill(Infinity));
  const back = Array.from({ length: rows }, () => Array(columns).fill(null));
  costs[0][0] = 0;

  for (let regionIndex = 1; regionIndex < columns; regionIndex += 1) {
    costs[0][regionIndex] = costs[0][regionIndex - 1] + vadSkipRegionCost;
    back[0][regionIndex] = { kind: "skip-region" };
  }

  for (let slotIndex = 1; slotIndex < rows; slotIndex += 1) {
    for (let regionIndex = 1; regionIndex < columns; regionIndex += 1) {
      const matchCost = costs[slotIndex - 1][regionIndex - 1]
        + speechSlotMatchCost(slots[slotIndex - 1], regions[regionIndex - 1], assignments);
      if (matchCost < costs[slotIndex][regionIndex]) {
        costs[slotIndex][regionIndex] = matchCost;
        back[slotIndex][regionIndex] = { kind: "match" };
      }

      const skipCost = costs[slotIndex][regionIndex - 1] + vadSkipRegionCost;
      if (skipCost < costs[slotIndex][regionIndex]) {
        costs[slotIndex][regionIndex] = skipCost;
        back[slotIndex][regionIndex] = { kind: "skip-region" };
      }
    }
  }

  if (!Number.isFinite(costs.at(-1).at(-1))) return null;
  const regionIndexes = Array(slots.length).fill(-1);
  const skippedRegionIndexes = [];
  let slotIndex = slots.length;
  let regionIndex = regions.length;
  while (slotIndex > 0 || regionIndex > 0) {
    const step = back[slotIndex][regionIndex];
    if (step?.kind === "match") {
      regionIndexes[slotIndex - 1] = regionIndex - 1;
      slotIndex -= 1;
      regionIndex -= 1;
      continue;
    }
    if (step?.kind === "skip-region") {
      skippedRegionIndexes.push(regionIndex - 1);
      regionIndex -= 1;
      continue;
    }
    return null;
  }

  return { regionIndexes, skippedRegionIndexes: skippedRegionIndexes.reverse() };
}

function speechSlotMatchCost(slot, region, assignments) {
  const assignment = assignments[slot.itemIndex];
  if (!assignment) return 0.5;
  const overlap = intervalOverlap(assignment.start, assignment.end, region.start, region.end);
  if (overlap > 0) return 0;
  const gap = Math.max(assignment.start - region.end, region.start - assignment.end, 0);
  return Math.min(4, gap / vadAnchorDistanceScale);
}

function itemTimingsFromSpeechSlots(items, slots, regionIndexes, regions) {
  const itemRegions = Array.from({ length: items.length }, () => []);
  slots.forEach((slot, slotIndex) => {
    const region = regions[regionIndexes[slotIndex]];
    if (region) itemRegions[slot.itemIndex].push(region);
  });
  return itemRegions.map((regionsForItem) => ({
    start: regionsForItem[0].start,
    end: regionsForItem.at(-1).end,
    activeDuration: regionsForItem.reduce((total, region) => total + region.duration, 0),
    regions: regionsForItem
  }));
}

function withSpeechPlaybackBounds(timings) {
  return timings.map((timing, index) => {
    const previous = timings[index - 1] || null;
    const next = timings[index + 1] || null;
    const paddedStart = Math.max(
      0,
      timing.start - vadStartPadding,
      previous ? previous.end + vadBoundaryGap : 0
    );
    const paddedEnd = Math.min(
      timing.end + vadEndPadding,
      next ? next.start - vadBoundaryGap : Infinity
    );
    return {
      ...timing,
      paddedStart: round(paddedStart),
      paddedEnd: round(Math.max(paddedStart, paddedEnd))
    };
  });
}

function detectSpeechRegions(audioPath) {
  const result = spawnSync(ffmpeg, [
    "-hide_banner",
    "-i", audioPath,
    "-af", `silencedetect=noise=${vadNoiseThreshold}:d=${vadMinimumSilence}`,
    "-f", "null",
    "-"
  ], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`ffmpeg silence detection failed: ${result.stderr}`);

  const duration = mediaDurationFromFfmpeg(result.stderr);
  const silences = [];
  let silenceStart = null;
  for (const line of result.stderr.split(/\r?\n/)) {
    const startMatch = line.match(/silence_start:\s*([0-9.]+)/);
    if (startMatch) silenceStart = Number(startMatch[1]);
    const endMatch = line.match(/silence_end:\s*([0-9.]+)/);
    if (endMatch) {
      silences.push({ start: silenceStart ?? 0, end: Number(endMatch[1]) });
      silenceStart = null;
    }
  }
  if (silenceStart !== null) silences.push({ start: silenceStart, end: duration });

  const regions = [];
  let cursor = 0;
  for (const silence of silences) {
    if (silence.start - cursor >= 0.12) regions.push(makeSpeechRegion(cursor, silence.start));
    cursor = Math.max(cursor, silence.end);
  }
  if (duration - cursor >= 0.12) regions.push(makeSpeechRegion(cursor, duration));
  return { duration, regions };
}

function mergeInternalSpeechPauses(inputRegions, expectedCount) {
  const regions = inputRegions.map((region) => ({ ...region }));
  while (regions.length > expectedCount) {
    let bestIndex = -1;
    let bestGap = Infinity;
    for (let index = 0; index < regions.length - 1; index += 1) {
      const gap = regions[index + 1].start - regions[index].end;
      if (gap < bestGap) {
        bestGap = gap;
        bestIndex = index;
      }
    }
    if (bestIndex < 0 || bestGap > vadInternalPause) break;
    const left = regions[bestIndex];
    const right = regions[bestIndex + 1];
    regions.splice(bestIndex, 2, {
      start: left.start,
      end: right.end,
      duration: left.duration + right.duration,
      parts: [...(left.parts || [left]), ...(right.parts || [right])]
    });
  }
  return regions;
}

function expectedUtteranceCount(item) {
  const value = String(item.kana || item.writing || "");
  return Math.max(1, value.split(/[\/／]/u).map((part) => normalizeWordText(part)).filter(Boolean).length);
}

function makeSpeechRegion(start, end) {
  return { start, end, duration: end - start };
}

function mediaDurationFromFfmpeg(output) {
  const match = String(output || "").match(/Duration:\s*(\d+):(\d+):([0-9.]+)/);
  if (!match) throw new Error("Could not read audio duration from ffmpeg output.");
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

function intervalOverlap(leftStart, leftEnd, rightStart, rightEnd) {
  return Math.max(0, Math.min(leftEnd, rightEnd) - Math.max(leftStart, rightStart));
}

function minimumSegmentDuration(item) {
  const units = pronunciationUnitCount(item.kana || item.writing || item.rawText || "");
  return round(Math.min(1.5, Math.max(0.45, units * 0.28)));
}

function pronunciationUnitCount(value) {
  const normalized = normalizeWordText(value);
  if (!normalized) return 1;
  const withoutSmallKana = normalized.replace(/[ゃゅょぁぃぅぇぉャュョァィゥェォ]/gu, "");
  return Math.max(1, [...withoutSmallKana].length);
}

function reviewStatusForSegments(segments) {
  if (segments.length && segments.every((segment) => segment.review?.status === "approved")) return "approved";
  if (segments.some((segment) => segment.review?.status === "approved")) return "in-review";
  return "pending";
}

function alignItems(items, words) {
  const maxGroupSize = 8;
  const skipCost = 0.02;
  const dp = Array.from({ length: items.length + 1 }, () => Array(words.length + 1).fill(Infinity));
  const back = Array.from({ length: items.length + 1 }, () => Array(words.length + 1).fill(null));
  dp[0][0] = 0;

  for (let j = 1; j <= words.length; j += 1) {
    dp[0][j] = dp[0][j - 1] + skipCost;
    back[0][j] = { kind: "skip-word" };
  }

  for (let i = 1; i <= items.length; i += 1) {
    for (let j = 0; j <= words.length; j += 1) {
      if (!Number.isFinite(dp[i - 1][j])) continue;
      for (let size = 1; size <= maxGroupSize && j + size <= words.length; size += 1) {
        const group = words.slice(j, j + size);
        const score = itemScore(items[i - 1], group);
        const cost = dp[i - 1][j] + (1 - score) + (size - 1) * 0.03;
        if (cost < dp[i][j + size]) {
          dp[i][j + size] = cost;
          back[i][j + size] = { kind: "match", from: j, score };
        }
      }
    }

    for (let j = 1; j <= words.length; j += 1) {
      const cost = dp[i][j - 1] + skipCost;
      if (cost < dp[i][j]) {
        dp[i][j] = cost;
        back[i][j] = { kind: "skip-word" };
      }
    }
  }

  let j = dp[items.length].reduce((best, value, index) => value < dp[items.length][best] ? index : best, 0);
  const result = [];
  for (let i = items.length; i > 0;) {
    const step = back[i][j];
    if (step?.kind === "match") {
      const group = words.slice(step.from, j);
      result.unshift({
        item: items[i - 1],
        words: group,
        start: group[0].start,
        end: group[group.length - 1].end,
        score: step.score
      });
      j = step.from;
      i -= 1;
      continue;
    }
    if (j === 0) throw new Error("Could not build a monotonic vocabulary alignment.");
    j -= 1;
  }
  return result;
}

function itemScore(item, words) {
  const actual = normalizeWordText(words.map((word) => word.text).join(""));
  const refs = referenceStrings(item);
  const scores = refs.map((ref) => similarity(ref, actual)).filter(Number.isFinite);
  return scores.length ? Math.max(...scores) : 0;
}

function referenceStrings(item) {
  const refs = [];
  for (const value of [item.kana, item.writing]) {
    const normalized = normalizeWordText(value);
    if (normalized) refs.push(normalized);
  }
  if (!refs.length && item.rawText) {
    refs.push(normalizeWordText(item.rawText.replace(/\[[^\]]*\]/g, "")));
  }
  return [...new Set(refs)];
}

function normalizeWords(phrases) {
  let globalIndex = 0;
  return phrases.flatMap((phrase, phraseIndex) => {
    const words = (phrase.words || []).map((word, wordIndex) => {
      const offset = Number(word.start ?? word.offset ?? 0);
      const duration = Number(word.duration ?? word.Duration ?? 0);
      return {
        index: globalIndex += 1,
        text: String(word.text || "").trim(),
        start: millis(offset),
        end: millis(offset + duration),
        confidence: Number(word.confidence || phrase.confidence || 0),
        phraseIndex,
        wordIndex
      };
    }).filter((word) => word.end > word.start && word.text);
    if (words.length) return words;
    const fallbackText = String(phrase.text || "").trim();
    if (!fallbackText) return [];
    const offset = Number(phrase.offset ?? 0);
    const duration = Number(phrase.duration ?? 0);
    return [{
      index: globalIndex += 1,
      text: fallbackText,
      start: millis(offset),
      end: millis(offset + duration),
      confidence: Number(phrase.confidence || 0),
      phraseIndex,
      wordIndex: 0
    }];
  }).filter((word) => word.end > word.start);
}

async function transcribe(audioPath, key, region, vocabulary) {
  const wavPath = toWav(audioPath);
  const config = speechsdk.SpeechConfig.fromSubscription(key, region);
  config.speechRecognitionLanguage = "ja-JP";
  config.outputFormat = speechsdk.OutputFormat.Detailed;
  config.requestWordLevelTimestamps();
  const audio = speechsdk.AudioConfig.fromWavFileInput(readFileSync(wavPath), basename(wavPath));
  const recognizer = new speechsdk.SpeechRecognizer(config, audio);
  const phraseList = speechsdk.PhraseListGrammar.fromRecognizer(recognizer);
  for (const item of vocabulary) {
    for (const phrase of [item.kana, item.writing].filter(Boolean)) phraseList.addPhrase(phrase);
  }
  const phrases = [];

  return new Promise((resolve, reject) => {
    let finished = false;
    const finish = (error) => {
      if (finished) return;
      finished = true;
      recognizer.close();
      if (error) reject(error);
      else resolve({
        phrases,
        combinedText: phrases.map((phrase) => phrase.text).join(" ").trim()
      });
    };

    recognizer.recognized = (_sender, event) => {
      if (event.result.reason !== speechsdk.ResultReason.RecognizedSpeech) return;
      const raw = event.result.properties.getProperty(speechsdk.PropertyId.SpeechServiceResponse_JsonResult);
      const detailed = raw ? JSON.parse(raw) : {};
      const best = detailed.NBest?.[0] || {};
      phrases.push({
        text: event.result.text || best.Display || best.Lexical || "",
        offset: event.result.offset,
        duration: event.result.duration,
        confidence: best.Confidence ?? 0,
        words: (best.Words || []).map((word) => ({
          text: word.Word || word.word || "",
          start: word.Offset ?? word.offset ?? 0,
          duration: word.Duration ?? word.duration ?? 0,
          confidence: word.Confidence ?? word.confidence ?? best.Confidence ?? 0
        }))
      });
    };
    recognizer.canceled = (_sender, event) => {
      if (event.reason === speechsdk.CancellationReason.EndOfStream) finish();
      else finish(new Error(`Azure continuous recognition canceled: ${event.errorDetails || event.reason}`));
    };
    recognizer.sessionStopped = () => finish();
    recognizer.startContinuousRecognitionAsync(undefined, (error) => finish(new Error(error)));
  });
}

function scoreToConfidence(score) {
  if (score >= 0.82) return "high";
  if (score >= 0.68) return "medium";
  return "needs-review";
}

function toWav(audioPath) {
  const dir = mkdtempSync(join(tmpdir(), "japaflow-vocab-align-"));
  const wavPath = join(dir, "audio.wav");
  const result = spawnSync(ffmpeg, ["-y", "-i", audioPath, "-ac", "1", "-ar", "16000", "-acodec", "pcm_s16le", wavPath], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${result.stderr}`);
  return wavPath;
}

function cachedAudioPath(lessonKey, filename) {
  const audioPath = join(cacheDir, filename);
  if (existsSync(audioPath)) return Promise.resolve(audioPath);
  return fetch(textbookAudioUrl(lessonNo, filename)).then(async (response) => {
    if (!response.ok) throw new Error(`Audio download failed for ${filename}: HTTP ${response.status}`);
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(audioPath, Buffer.from(await response.arrayBuffer()));
    return audioPath;
  });
}

function textbookAudioUrl(lesson, filename) {
  return `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit${Math.ceil(lesson / 4)}/lesson${lesson}/${filename}`;
}

function normalizeWordText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\s\p{P}\p{S}]/gu, "")
    .toLowerCase();
}

function similarity(left, right) {
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  return Math.max(0, 1 - distance / Math.max(left.length, right.length));
}

function levenshtein(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[right.length];
}

function relativeToRoot(filePath) {
  return filePath.slice(root.length + 1).replaceAll("\\", "/");
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function readJson(filePath) {
  if (!existsSync(filePath)) throw new Error(`Missing input JSON: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    const key = argv[index].slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) result[key] = true;
    else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function positiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error(`Invalid ${label}: ${value}`);
  return number;
}

function normalizeRegion(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function loadEnv() {
  const filePath = join(process.cwd(), ".env");
  if (!existsSync(filePath)) return;
  for (const raw of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    const index = line.indexOf("=");
    if (!line || line.startsWith("#") || index <= 0) continue;
    const key = line.slice(0, index).trim();
    if (process.env[key] !== undefined) continue;
    process.env[key] = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
  }
}

function round(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

function millis(value) {
  return round(Number(value || 0) / 10_000_000);
}
