export type PracticeSection = "practice_1" | "practice_2" | "vocabulary" | "culture_note";

export type PracticeInteraction =
  | "pattern_substitution"
  | "dialogue_practice"
  | "fill_blank"
  | "single_choice"
  | "multi_choice"
  | "true_false"
  | "sentence_ordering"
  | "translation"
  | "listening_repeat"
  | "listening_answer"
  | "role_play"
  | "reading_cloze";

export type AnswerUnit = "word" | "phrase" | "sentence" | "dialogue" | "choice" | "boolean" | "free_text" | "none";

export type InputUnit = "word" | "phrase" | "sentence" | "dialogue" | "particle" | "conjugated_form" | "number" | "boolean";

export type AnswerSource = "prompt" | "audio" | "example_transform" | "personal";

export type EvaluationMode = "exact" | "acceptable_answers" | "self_check" | "manual_review";

export type ResponseScope =
  | "word_only"
  | "phrase_only"
  | "sentence_only"
  | "dialogue_only"
  | "answer_only"
  | "question_and_answer"
  | "choice_only"
  | "boolean_only"
  | "free_response"
  | "custom";

export type RichText = {
  type: "text";
  text: string;
  kana?: string;
  underline?: boolean;
  substitutionKey?: string;
};

export type PromptPart =
  | RichText
  | { type: "blank"; slotId: string }
  | { type: "choice_ref"; choiceIds: string[] }
  | { type: "asset_ref"; assetId: string };

export type Choice = {
  id: string;
  label: string;
};

export type Answer = {
  slotValues?: Record<string, string | string[]>;
  modelAnswers?: string[];
  choiceIds?: string[];
  boolean?: boolean;
  acceptableAlternatives?: string[];
  note?: string;
};

export type InputSlot = {
  id: string;
  expectedUnit: InputUnit;
  width?: "short" | "medium" | "long";
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
};

export type PracticeItem = {
  id: string;
  number: string;
  exampleGroupId?: string;
  instruction?: string;
  answerSource?: AnswerSource;
  evaluationMode?: EvaluationMode;
  responseScope?: ResponseScope;
  responseScopeHint?: string;
  prompt: PromptPart[];
  promptKana?: string;
  inputSlots?: InputSlot[];
  choices?: Choice[];
  answer?: Answer;
  relatedAssets?: string[];
  renderHint?: "inline" | "dialogue" | "card" | "table_row" | "map_question";
};

export type ExampleBlock = {
  id?: string;
  label?: string;
  before?: string;
  beforeKana?: string;
  beforeParts?: PromptPart[];
  substitutionSlots?: {
    key: string;
    label: string;
    expectedUnit: InputUnit;
  }[];
  after: PromptPart[];
  afterKana?: string;
};

export type PracticeItemGroup = {
  id: string;
  title?: string;
  instruction?: string;
  displayAssets?: string[];
  example: ExampleBlock;
  items: PracticeItem[];
};

export type DialogueLine = {
  speaker: string;
  parts: PromptPart[];
  kana?: string;
};

export type Label = {
  text: string;
  x: number;
  y: number;
};

export type ImageAsset = {
  id: string;
  kind: "person_card" | "object_card" | "scene" | "map" | "table" | "source_crop";
  imagePath?: string;
  label?: string;
  crop?: {
    unit: "percent";
    x: number;
    y: number;
    width: number;
    height: number;
    aspectRatio?: number;
  };
  meta?: Record<string, string | number>;
};

export type LessonImageCropCatalog = {
  lessonId: string;
  sourceDir: string;
  selectedImages?: string[];
  pages: {
    pageNo: number;
    imagePath: string;
    assets: ImageAsset[];
  }[];
  assets: ImageAsset[];
};

export type ActivityAudio = {
  source: "textbook_exercise" | "external_url";
  url?: string;
  label?: string;
  transcript?: AudioTranscript;
};

export type AudioTranscript = {
  text: string;
  source: "asr" | "manual";
  segments?: {
    itemNumber?: string;
    speaker?: string;
    text: string;
  }[];
  confidenceNote?: string;
};

export type LayoutBlock =
  | { type: "text"; text: RichText[] }
  | { type: "example"; content: ExampleBlock }
  | { type: "dialogue"; lines: DialogueLine[] }
  | { type: "image_grid"; assets: ImageAsset[]; columns?: number }
  | { type: "map"; image: ImageAsset; labels?: Label[] }
  | { type: "word_bank"; words: RichText[] }
  | { type: "passage"; title?: string; lines: RichText[] };

export type VocabularyEntry = {
  kana: string;
  kanjiOrTerm: string;
  pos?: string;
  chinese: string;
};

export type SourcePage = {
  pageNo: number;
  imagePath: string;
};

export type PracticeActivity = {
  id: string;
  section: PracticeSection;
  order: number;
  title: string;
  instruction: string;
  interaction: PracticeInteraction;
  answerUnit: AnswerUnit;
  responseScope?: ResponseScope;
  responseScopeHint?: string;
  requiresAudio?: boolean;
  audio?: ActivityAudio;
  assets?: ImageAsset[];
  displayAssets?: string[];
  layout: LayoutBlock[];
  itemGroups?: PracticeItemGroup[];
  items: PracticeItem[];
};

export type LessonPractice = {
  lessonId: string;
  title: string;
  sourcePages: SourcePage[];
  vocabulary?: VocabularyEntry[];
  activities: PracticeActivity[];
};
