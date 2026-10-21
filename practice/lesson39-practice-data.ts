import type { LessonPractice } from "./lesson-practice-types";

export const lesson39Practice: LessonPractice = {
  "lessonId": "lesson39",
  "title": "第39课 练习",
  "sourcePages": [
    {
      "pageNo": 168,
      "imagePath": "../course-assets/by-lesson/lesson39/page168.webp"
    },
    {
      "pageNo": 169,
      "imagePath": "../course-assets/by-lesson/lesson39/page169.webp"
    },
    {
      "pageNo": 170,
      "imagePath": "../course-assets/by-lesson/lesson39/page170.webp"
    }
  ],
  "activities": [
    {
      "id": "l39-p1-a1",
      "section": "practice_1",
      "order": 1,
      "title": "仿照例句，将（　　）中的动词变成适当的形式进行练习。",
      "instruction": "",
      "interaction": "fill_blank",
      "answerUnit": "word",
      "responseScope": "word_only",
      "layout": [],
      "items": [],
      "itemGroups": [
        {
          "id": "l39-p1-a1-g1",
          "example": {
            "label": "[例1]",
            "after": [
              {
                "type": "text",
                "text": "森さんは傘を（持ちます → 持って）出かけました。",
                "kana": "もりさんはかさを（もちます → もって）でかけました。"
              }
            ],
            "afterKana": "もりさんはかさを（もちます → もって）でかけました。"
          },
          "items": [
            {
              "id": "l39-p1-a1-q1",
              "number": "1",
              "prompt": [
                {
                  "type": "text",
                  "text": "冬は帽子を（かぶります → ",
                  "kana": "ふゆはぼうしを（かぶります → "
                },
                {
                  "type": "blank",
                  "slotId": "answer",
                  "display": "underline"
                },
                {
                  "type": "text",
                  "text": "）出かけます。",
                  "kana": "）でかけます。"
                }
              ],
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "conjugated_form",
                  "width": "medium",
                  "placeholder": "填写变形后的词语"
                }
              ],
              "answerSource": "prompt",
              "evaluationMode": "exact",
              "answer": {
                "slotValues": {
                  "answer": "かぶって"
                }
              },
              "exampleGroupId": "l39-p1-a1-g1"
            },
            {
              "id": "l39-p1-a1-q2",
              "number": "2",
              "prompt": [
                {
                  "type": "text",
                  "text": "母にもらったネックレスを（します → ",
                  "kana": "ははにもらったネックレスを（します → "
                },
                {
                  "type": "blank",
                  "slotId": "answer",
                  "display": "underline"
                },
                {
                  "type": "text",
                  "text": "）パーティーに行きました。",
                  "kana": "）パーティーにいきました。"
                }
              ],
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "conjugated_form",
                  "width": "medium",
                  "placeholder": "填写变形后的词语"
                }
              ],
              "answerSource": "prompt",
              "evaluationMode": "exact",
              "answer": {
                "slotValues": {
                  "answer": "して"
                }
              },
              "exampleGroupId": "l39-p1-a1-g1"
            },
            {
              "id": "l39-p1-a1-q3",
              "number": "3",
              "prompt": [
                {
                  "type": "text",
                  "text": "時間がなかったので、タクシーに（乗ります → ",
                  "kana": "じかんがなかったので、タクシーに（のります → "
                },
                {
                  "type": "blank",
                  "slotId": "answer",
                  "display": "underline"
                },
                {
                  "type": "text",
                  "text": "）来ました。",
                  "kana": "）きました。"
                }
              ],
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "conjugated_form",
                  "width": "medium",
                  "placeholder": "填写变形后的词语"
                }
              ],
              "answerSource": "prompt",
              "evaluationMode": "exact",
              "answer": {
                "slotValues": {
                  "answer": "乗って"
                }
              },
              "exampleGroupId": "l39-p1-a1-g1"
            },
            {
              "id": "l39-p1-a1-q4",
              "number": "4",
              "prompt": [
                {
                  "type": "text",
                  "text": "今日は荷物が少ないので、（歩きます → ",
                  "kana": "きょうはにもつがすくないので、（あるきます → "
                },
                {
                  "type": "blank",
                  "slotId": "answer",
                  "display": "underline"
                },
                {
                  "type": "text",
                  "text": "）帰ります。",
                  "kana": "）かえります。"
                }
              ],
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "conjugated_form",
                  "width": "medium",
                  "placeholder": "填写变形后的词语"
                }
              ],
              "answerSource": "prompt",
              "evaluationMode": "exact",
              "answer": {
                "slotValues": {
                  "answer": "歩いて"
                }
              },
              "exampleGroupId": "l39-p1-a1-g1"
            }
          ]
        },
        {
          "id": "l39-p1-a1-g2",
          "example": {
            "label": "[例2]",
            "after": [
              {
                "type": "text",
                "text": "森さんは傘を（持ちません → 持たないで）行きました。",
                "kana": "もりさんはかさを（もちません → もたないで）いきました。"
              }
            ],
            "afterKana": "もりさんはかさを（もちません → もたないで）いきました。"
          },
          "items": [
            {
              "id": "l39-p1-a1-q5",
              "number": "5",
              "prompt": [
                {
                  "type": "text",
                  "text": "祖母は70歳ですが、眼鏡を（かけません → ",
                  "kana": "そぼはななじゅっさいですが、めがねを（かけません → "
                },
                {
                  "type": "blank",
                  "slotId": "answer",
                  "display": "underline"
                },
                {
                  "type": "text",
                  "text": "）本を読みます。",
                  "kana": "）ほんをよみます。"
                }
              ],
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "conjugated_form",
                  "width": "medium",
                  "placeholder": "填写变形后的词语"
                }
              ],
              "answerSource": "prompt",
              "evaluationMode": "exact",
              "answer": {
                "slotValues": {
                  "answer": "かけないで"
                }
              },
              "exampleGroupId": "l39-p1-a1-g2"
            },
            {
              "id": "l39-p1-a1-q6",
              "number": "6",
              "prompt": [
                {
                  "type": "text",
                  "text": "砂糖を（入れません → ",
                  "kana": "さとうを（いれません → "
                },
                {
                  "type": "blank",
                  "slotId": "answer",
                  "display": "underline"
                },
                {
                  "type": "text",
                  "text": "）コーヒーを飲んでみます。",
                  "kana": "）コーヒーをのんでみます。"
                }
              ],
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "conjugated_form",
                  "width": "medium",
                  "placeholder": "填写变形后的词语"
                }
              ],
              "answerSource": "prompt",
              "evaluationMode": "exact",
              "answer": {
                "slotValues": {
                  "answer": "入れないで"
                }
              },
              "exampleGroupId": "l39-p1-a1-g2"
            },
            {
              "id": "l39-p1-a1-q7",
              "number": "7",
              "prompt": [
                {
                  "type": "text",
                  "text": "話をよく（聞きません → ",
                  "kana": "はなしをよく（ききません → "
                },
                {
                  "type": "blank",
                  "slotId": "answer",
                  "display": "underline"
                },
                {
                  "type": "text",
                  "text": "）書いたので、間違えました。",
                  "kana": "）かいたので、まちがえました。"
                }
              ],
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "conjugated_form",
                  "width": "medium",
                  "placeholder": "填写变形后的词语"
                }
              ],
              "answerSource": "prompt",
              "evaluationMode": "exact",
              "answer": {
                "slotValues": {
                  "answer": "聞かないで"
                }
              },
              "exampleGroupId": "l39-p1-a1-g2"
            },
            {
              "id": "l39-p1-a1-q8",
              "number": "8",
              "prompt": [
                {
                  "type": "text",
                  "text": "明日のスピーチは原稿を（見ません → ",
                  "kana": "あしたのスピーチはげんこうを（みません → "
                },
                {
                  "type": "blank",
                  "slotId": "answer",
                  "display": "underline"
                },
                {
                  "type": "text",
                  "text": "）するつもりです。",
                  "kana": "）するつもりです。"
                }
              ],
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "conjugated_form",
                  "width": "medium",
                  "placeholder": "填写变形后的词语"
                }
              ],
              "answerSource": "prompt",
              "evaluationMode": "exact",
              "answer": {
                "slotValues": {
                  "answer": "見ないで"
                }
              },
              "exampleGroupId": "l39-p1-a1-g2"
            }
          ]
        }
      ]
    },
    {
      "id": "l39-p1-a2",
      "section": "practice_1",
      "order": 2,
      "title": "仿照例句替换画线部分进行练习。",
      "instruction": "",
      "interaction": "pattern_substitution",
      "answerUnit": "sentence",
      "responseScope": "sentence_only",
      "layout": [],
      "items": [],
      "itemGroups": [
        {
          "id": "l39-p1-a2-g1",
          "example": {
            "label": "[例1]",
            "after": [
              {
                "type": "text",
                "text": "道路工事",
                "kana": "どうろこうじ",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "のために、"
              },
              {
                "type": "text",
                "text": "道が込んでいます",
                "kana": "みちがこんでいます",
                "underline": true,
                "substitutionKey": "part2"
              },
              {
                "type": "text",
                "text": "。"
              }
            ],
            "before": "道路工事／道が込んでいます",
            "beforeKana": "どうろこうじ／みちがこんでいます",
            "afterKana": "どうろこうじのために、みちがこんでいます。"
          },
          "items": [
            {
              "id": "l39-p1-a2-q1",
              "number": "1",
              "prompt": [
                {
                  "type": "text",
                  "text": "病気／欠席しました"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "病気のために、欠席しました。"
                }
              },
              "promptKana": "びょうき／けっせきしました",
              "exampleGroupId": "l39-p1-a2-g1"
            },
            {
              "id": "l39-p1-a2-q2",
              "number": "2",
              "prompt": [
                {
                  "type": "text",
                  "text": "故障／この電話は使えません"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "故障のために、この電話は使えません。"
                }
              },
              "promptKana": "こしょう／このでんわはつかえません",
              "exampleGroupId": "l39-p1-a2-g1"
            },
            {
              "id": "l39-p1-a2-q3",
              "number": "3",
              "prompt": [
                {
                  "type": "text",
                  "text": "貸し切り／一般の人は入れません"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "貸し切りのために、一般の人は入れません。"
                }
              },
              "promptKana": "かしきり／いっぱんのひとははいれません",
              "exampleGroupId": "l39-p1-a2-g1"
            },
            {
              "id": "l39-p1-a2-q4",
              "number": "4",
              "prompt": [
                {
                  "type": "text",
                  "text": "台風／音楽会は中止です"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "台風のために、音楽会は中止です。"
                }
              },
              "promptKana": "たいふう／おんがくかいはちゅうしです",
              "exampleGroupId": "l39-p1-a2-g1"
            },
            {
              "id": "l39-p1-a2-q5",
              "number": "5",
              "prompt": [
                {
                  "type": "text",
                  "text": "地震／家が壊れました"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "地震のために、家が壊れました。"
                }
              },
              "promptKana": "じしん／いえがこわれました",
              "exampleGroupId": "l39-p1-a2-g1"
            },
            {
              "id": "l39-p1-a2-q6",
              "number": "6",
              "prompt": [
                {
                  "type": "text",
                  "text": "雪／バスが遅れています"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "雪のために、バスが遅れています。"
                }
              },
              "promptKana": "ゆき／バスがおくれています",
              "exampleGroupId": "l39-p1-a2-g1"
            }
          ]
        },
        {
          "id": "l39-p1-a2-g2",
          "example": {
            "label": "[例2]",
            "after": [
              {
                "type": "text",
                "text": "事故があった",
                "kana": "じこがあった",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "ために、"
              },
              {
                "type": "text",
                "text": "電車が止まりました",
                "kana": "でんしゃがとまりました",
                "underline": true,
                "substitutionKey": "part2"
              },
              {
                "type": "text",
                "text": "。"
              }
            ],
            "before": "事故がありました／電車が止まりました",
            "beforeKana": "じこがありました／でんしゃがとまりました",
            "afterKana": "じこがあったために、でんしゃがとまりました。"
          },
          "items": [
            {
              "id": "l39-p1-a2-q7",
              "number": "7",
              "prompt": [
                {
                  "type": "text",
                  "text": "大雨が降りました／野球は中止になりました"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "大雨が降ったために、野球は中止になりました。"
                }
              },
              "promptKana": "おおあめがふりました／やきゅうはちゅうしになりました",
              "exampleGroupId": "l39-p1-a2-g2"
            },
            {
              "id": "l39-p1-a2-q8",
              "number": "8",
              "prompt": [
                {
                  "type": "text",
                  "text": "円高が続きました／輸出に影響が出ています"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "円高が続いたために、輸出に影響が出ています。"
                }
              },
              "promptKana": "えんだかがつづきました／ゆしゅつにえいきょうがでています",
              "exampleGroupId": "l39-p1-a2-g2"
            },
            {
              "id": "l39-p1-a2-q9",
              "number": "9",
              "prompt": [
                {
                  "type": "text",
                  "text": "車が急に増えました／交通事故が増えました"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "車が急に増えたために、交通事故が増えました。"
                }
              },
              "promptKana": "くるまがきゅうにふえました／こうつうじこがふえました",
              "exampleGroupId": "l39-p1-a2-g2"
            }
          ]
        },
        {
          "id": "l39-p1-a2-g3",
          "example": {
            "label": "[例2]",
            "after": [
              {
                "type": "text",
                "text": "風が非常に強い",
                "kana": "かぜがひじょうにつよい",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "ために、"
              },
              {
                "type": "text",
                "text": "野外コンサートは中止です",
                "kana": "やがいコンサートはちゅうしです",
                "underline": true,
                "substitutionKey": "part2"
              },
              {
                "type": "text",
                "text": "。"
              }
            ],
            "before": "風が非常に強いです／野外コンサートは中止です",
            "beforeKana": "かぜがひじょうにつよいです／やがいコンサートはちゅうしです",
            "afterKana": "かぜがひじょうにつよいために、やがいコンサートはちゅうしです。"
          },
          "items": [
            {
              "id": "l39-p1-a2-q10",
              "number": "10",
              "prompt": [
                {
                  "type": "text",
                  "text": "日本は資源が少ないです／資源のほとんどを海外から輸入しています"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "日本は資源が少ないために、資源のほとんどを海外から輸入しています。"
                }
              },
              "promptKana": "にほんはしげんがすくないです／しげんのほとんどをかいがいからゆにゅうしています",
              "exampleGroupId": "l39-p1-a2-g3"
            },
            {
              "id": "l39-p1-a2-q11",
              "number": "11",
              "prompt": [
                {
                  "type": "text",
                  "text": "思ったより高かったです／買うことができませんでした"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "思ったより高かったために、買うことができませんでした。"
                }
              },
              "promptKana": "おもったよりたかかったです／かうことができませんでした",
              "exampleGroupId": "l39-p1-a2-g3"
            },
            {
              "id": "l39-p1-a2-q12",
              "number": "12",
              "prompt": [
                {
                  "type": "text",
                  "text": "今年の夏は気温が低かったです／稲がよく育ちませんでした"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "今年の夏は気温が低かったために、稲がよく育ちませんでした。"
                }
              },
              "promptKana": "ことしのなつはきおんがひくかったです／いねがよくそだちませんでした",
              "exampleGroupId": "l39-p1-a2-g3"
            }
          ]
        }
      ]
    },
    {
      "id": "l39-p1-a3",
      "section": "practice_1",
      "order": 3,
      "title": "仿照例句替换画线部分进行练习。",
      "instruction": "",
      "interaction": "pattern_substitution",
      "answerUnit": "sentence",
      "responseScope": "sentence_only",
      "layout": [],
      "items": [],
      "itemGroups": [
        {
          "id": "l39-p1-a3-g1",
          "example": {
            "label": "[例1]",
            "after": [
              {
                "type": "text",
                "text": "駅まで走って",
                "kana": "えきまではしって",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "いきます。"
              }
            ],
            "before": "駅まで走ります",
            "beforeKana": "えきまではしります",
            "afterKana": "えきまではしっていきます。"
          },
          "items": [
            {
              "id": "l39-p1-a3-q1",
              "number": "1",
              "prompt": [
                {
                  "type": "text",
                  "text": "地下鉄に乗ります"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "地下鉄に乗っていきます。"
                }
              },
              "promptKana": "ちかてつにのります",
              "exampleGroupId": "l39-p1-a3-g1"
            },
            {
              "id": "l39-p1-a3-q2",
              "number": "2",
              "prompt": [
                {
                  "type": "text",
                  "text": "馬さんが自転車で帰ります"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "馬さんが自転車で帰っていきます。"
                }
              },
              "promptKana": "ばさんがじてんしゃでかえります",
              "exampleGroupId": "l39-p1-a3-g1"
            },
            {
              "id": "l39-p1-a3-q3",
              "number": "3",
              "prompt": [
                {
                  "type": "text",
                  "text": "クジラが沖へ泳ぎます"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "クジラが沖へ泳いでいきます。"
                }
              },
              "promptKana": "クジラがおきへおよぎます",
              "exampleGroupId": "l39-p1-a3-g1"
            },
            {
              "id": "l39-p1-a3-q4",
              "number": "4",
              "prompt": [
                {
                  "type": "text",
                  "text": "鳥が山の方へ飛びます"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "鳥が山の方へ飛んでいきます。"
                }
              },
              "promptKana": "とりがやまのほうへとびます",
              "exampleGroupId": "l39-p1-a3-g1"
            }
          ]
        },
        {
          "id": "l39-p1-a3-g2",
          "example": {
            "label": "[例2]",
            "after": [
              {
                "type": "text",
                "text": "こちらに"
              },
              {
                "type": "text",
                "text": "歩いて",
                "kana": "あるいて",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "くるのは"
              },
              {
                "type": "text",
                "text": "有名な歌手",
                "kana": "ゆうめいなかしゅ",
                "underline": true,
                "substitutionKey": "part2"
              },
              {
                "type": "text",
                "text": "じゃありませんか。"
              }
            ],
            "before": "こちらに歩きます／有名な歌手",
            "beforeKana": "こちらにあるきます／ゆうめいなかしゅ",
            "afterKana": "こちらにあるいてくるのはゆうめいなかしゅじゃありませんか。"
          },
          "items": [
            {
              "id": "l39-p1-a3-q5",
              "number": "5",
              "prompt": [
                {
                  "type": "text",
                  "text": "走ります／森さん"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "こちらに走ってくるのは森さんじゃありませんか。"
                }
              },
              "promptKana": "はしります／もりさん",
              "exampleGroupId": "l39-p1-a3-g2"
            },
            {
              "id": "l39-p1-a3-q6",
              "number": "6",
              "prompt": [
                {
                  "type": "text",
                  "text": "飛びます／UFO"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "こちらに飛んでくるのはUFOじゃありませんか。"
                }
              },
              "promptKana": "とびます／ユーフォー",
              "exampleGroupId": "l39-p1-a3-g2"
            },
            {
              "id": "l39-p1-a3-q7",
              "number": "7",
              "prompt": [
                {
                  "type": "text",
                  "text": "泳ぎます／サメ"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "こちらに泳いでくるのはサメじゃありませんか。"
                }
              },
              "promptKana": "およぎます／サメ",
              "exampleGroupId": "l39-p1-a3-g2"
            },
            {
              "id": "l39-p1-a3-q8",
              "number": "8",
              "prompt": [
                {
                  "type": "text",
                  "text": "歩きます／森さんのお母さん"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "こちらに歩いてくるのは森さんのお母さんじゃありませんか。"
                }
              },
              "promptKana": "あるきます／もりさんのおかあさん",
              "exampleGroupId": "l39-p1-a3-g2"
            }
          ]
        },
        {
          "id": "l39-p1-a3-g3",
          "example": {
            "label": "[例3]",
            "after": [
              {
                "type": "text",
                "text": "新聞を買って",
                "kana": "しんぶんをかって",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "きます。"
              }
            ],
            "before": "新聞を買います",
            "beforeKana": "しんぶんをかいます",
            "afterKana": "しんぶんをかってきます。"
          },
          "items": [
            {
              "id": "l39-p1-a3-q9",
              "number": "9",
              "prompt": [
                {
                  "type": "text",
                  "text": "手紙を出します"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "手紙を出してきます。"
                }
              },
              "promptKana": "てがみをだします",
              "exampleGroupId": "l39-p1-a3-g3"
            },
            {
              "id": "l39-p1-a3-q10",
              "number": "10",
              "prompt": [
                {
                  "type": "text",
                  "text": "手を洗います"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "手を洗ってきます。"
                }
              },
              "promptKana": "てをあらいます",
              "exampleGroupId": "l39-p1-a3-g3"
            },
            {
              "id": "l39-p1-a3-q11",
              "number": "11",
              "prompt": [
                {
                  "type": "text",
                  "text": "図書館で調べます"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "図書館で調べてきます。"
                }
              },
              "promptKana": "としょかんでしらべます",
              "exampleGroupId": "l39-p1-a3-g3"
            },
            {
              "id": "l39-p1-a3-q12",
              "number": "12",
              "prompt": [
                {
                  "type": "text",
                  "text": "友達に会います"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "友達に会ってきます。"
                }
              },
              "promptKana": "ともだちにあいます",
              "exampleGroupId": "l39-p1-a3-g3"
            },
            {
              "id": "l39-p1-a3-q13",
              "number": "13",
              "prompt": [
                {
                  "type": "text",
                  "text": "電話をします"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "電話をしてきます。"
                }
              },
              "promptKana": "でんわをします",
              "exampleGroupId": "l39-p1-a3-g3"
            },
            {
              "id": "l39-p1-a3-q14",
              "number": "14",
              "prompt": [
                {
                  "type": "text",
                  "text": "先生に報告します"
                }
              ],
              "answerSource": "example_transform",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "sentence",
                  "width": "long",
                  "placeholder": "填写完整句子"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "先生に報告してきます。"
                }
              },
              "promptKana": "せんせいにほうこくします",
              "exampleGroupId": "l39-p1-a3-g3"
            }
          ]
        }
      ]
    },
    {
      "id": "l39-p1-a4",
      "section": "practice_1",
      "order": 4,
      "title": "听录音，仿照例句替换画线部分练习会话。",
      "instruction": "",
      "interaction": "dialogue_practice",
      "answerUnit": "dialogue",
      "responseScope": "dialogue_only",
      "layout": [],
      "items": [],
      "responseScopeHint": "填写完整会话，保留甲、乙各轮台词。",
      "itemGroups": [
        {
          "id": "l39-p1-a4-g1",
          "example": {
            "label": "[例1]",
            "after": [
              {
                "type": "text",
                "text": "甲："
              },
              {
                "type": "text",
                "text": "お茶がなくなりました",
                "kana": "おちゃがなくなりました",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "ね。\n乙：じゃあ、"
              },
              {
                "type": "text",
                "text": "買って",
                "kana": "かって",
                "underline": true,
                "substitutionKey": "part2"
              },
              {
                "type": "text",
                "text": "きましょうか。\n甲：ええ、お願いします。"
              }
            ],
            "before": "お茶がなくなりました／買います",
            "beforeKana": "おちゃがなくなりました／かいます",
            "afterKana": "こう：おちゃがなくなりましたね。\nおつ：じゃあ、かってきましょうか。\nこう：ええ、おねがいします。"
          },
          "items": [
            {
              "id": "l39-p1-a4-q1",
              "number": "1",
              "prompt": [
                {
                  "type": "text",
                  "text": "鈴木さんの家の電話番号が分かりません／聞きます"
                }
              ],
              "answerSource": "audio",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "dialogue",
                  "width": "long",
                  "multiline": true,
                  "rows": 4,
                  "placeholder": "填写完整对话"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "甲：鈴木さんの家の電話番号が分かりませんね。\n乙：じゃあ、聞いてきましょうか。\n甲：ええ、お願いします。"
                }
              },
              "promptKana": "すずきさんのいえのでんわばんごうがわかりません／ききます",
              "exampleGroupId": "l39-p1-a4-g1"
            },
            {
              "id": "l39-p1-a4-q2",
              "number": "2",
              "prompt": [
                {
                  "type": "text",
                  "text": "森さんが来ません／電話をかけます"
                }
              ],
              "answerSource": "audio",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "dialogue",
                  "width": "long",
                  "multiline": true,
                  "rows": 4,
                  "placeholder": "填写完整对话"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "甲：森さんが来ませんね。\n乙：じゃあ、電話をかけてきましょうか。\n甲：ええ、お願いします。"
                }
              },
              "promptKana": "もりさんがきません／でんわをかけます",
              "exampleGroupId": "l39-p1-a4-g1"
            },
            {
              "id": "l39-p1-a4-q3",
              "number": "3",
              "prompt": [
                {
                  "type": "text",
                  "text": "のどが渇きました／飲み物を買います"
                }
              ],
              "answerSource": "audio",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "dialogue",
                  "width": "long",
                  "multiline": true,
                  "rows": 4,
                  "placeholder": "填写完整对话"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "甲：のどが渇きましたね。\n乙：じゃあ、飲み物を買ってきましょうか。\n甲：ええ、お願いします。"
                }
              },
              "promptKana": "のどがかわきました／のみものをかいます",
              "exampleGroupId": "l39-p1-a4-g1"
            },
            {
              "id": "l39-p1-a4-q4",
              "number": "4",
              "prompt": [
                {
                  "type": "text",
                  "text": "コップが汚いです／洗います"
                }
              ],
              "answerSource": "audio",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "dialogue",
                  "width": "long",
                  "multiline": true,
                  "rows": 4,
                  "placeholder": "填写完整对话"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "甲：コップが汚いですね。\n乙：じゃあ、洗ってきましょうか。\n甲：ええ、お願いします。"
                }
              },
              "promptKana": "コップがきたないです／あらいます",
              "exampleGroupId": "l39-p1-a4-g1"
            }
          ]
        },
        {
          "id": "l39-p1-a4-g2",
          "example": {
            "label": "[例2]",
            "after": [
              {
                "type": "text",
                "text": "甲：お帰りなさい。どこに行っていたんですか。\n乙："
              },
              {
                "type": "text",
                "text": "写真展を見て",
                "kana": "しゃしんてんをみて",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "きました。\n甲：よかったですか。\n乙：ええ、まあまあでした。"
              }
            ],
            "before": "写真展を見ました",
            "beforeKana": "しゃしんてんをみました",
            "afterKana": "こう：おかえりなさい。どこにいっていたんですか。\nおつ：しゃしんてんをみてきました。\nこう：よかったですか。\nおつ：ええ、まあまあでした。"
          },
          "items": [
            {
              "id": "l39-p1-a4-q5",
              "number": "5",
              "prompt": [
                {
                  "type": "text",
                  "text": "映画を見ました"
                }
              ],
              "answerSource": "audio",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "dialogue",
                  "width": "long",
                  "multiline": true,
                  "rows": 4,
                  "placeholder": "填写完整对话"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "甲：お帰りなさい。どこに行っていたんですか。\n乙：映画を見てきました。\n甲：よかったですか。\n乙：ええ、まあまあでした。"
                }
              },
              "promptKana": "えいがをみました",
              "exampleGroupId": "l39-p1-a4-g2"
            },
            {
              "id": "l39-p1-a4-q6",
              "number": "6",
              "prompt": [
                {
                  "type": "text",
                  "text": "ジャズを聞きました"
                }
              ],
              "answerSource": "audio",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "dialogue",
                  "width": "long",
                  "multiline": true,
                  "rows": 4,
                  "placeholder": "填写完整对话"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "甲：お帰りなさい。どこに行っていたんですか。\n乙：ジャズを聞いてきました。\n甲：よかったですか。\n乙：ええ、まあまあでした。"
                }
              },
              "promptKana": "ジャズをききました",
              "exampleGroupId": "l39-p1-a4-g2"
            },
            {
              "id": "l39-p1-a4-q7",
              "number": "7",
              "prompt": [
                {
                  "type": "text",
                  "text": "音楽会に行きました"
                }
              ],
              "answerSource": "audio",
              "evaluationMode": "exact",
              "inputSlots": [
                {
                  "id": "answer",
                  "expectedUnit": "dialogue",
                  "width": "long",
                  "multiline": true,
                  "rows": 4,
                  "placeholder": "填写完整对话"
                }
              ],
              "answer": {
                "slotValues": {
                  "answer": "甲：お帰りなさい。どこに行っていたんですか。\n乙：音楽会に行ってきました。\n甲：よかったですか。\n乙：ええ、まあまあでした。"
                }
              },
              "promptKana": "おんがくかいにいきました",
              "exampleGroupId": "l39-p1-a4-g2"
            }
          ]
        }
      ],
      "requiresAudio": true,
      "audio": {
        "source": "textbook_exercise",
        "transcript": {
          "source": "asr",
          "text": "零、一。お茶がなくなりました。買います。お茶がなくなりましたね。じゃあ買ってきましょうか。ええ、お願いします。一。鈴木さんの家の電話番号がわかりません。聞きます。鈴木さんの家の電話番号が。わかりませんね。じゃあ聞いてきましょうか。ええ、お願いします。二森さんが来ません。電話をかけます。森さんが来ませんね。じゃあ、電話をかけてきましょうか。ええ。お願いします。三。喉が渇きました。飲み物を買います。喉が渇きましたね。じゃあ、飲み物を買ってきましょうか。\n来ません。電話をかけます。森さんが来ませんね。じゃあ、電話をかけてきましょうか。ええ。お願いします。三。喉が渇きました。飲み物を買います。喉が渇きましたね。じゃあ、飲み物を買ってきましょうか。ええ、お願いします。四、コップが汚いです。洗います。コップが汚いですね。じゃあ洗ってきましょうか。え？\n汚いですね。じゃあ、洗ってきましょうか。ええ。お願いします。零。写真展を見ました。おかえりなさい。どこに行っていたんですか？写真展を見てきました。よかったですか？ええ、まあまあでした。五、映画を見ました。おかえりなさい。どこに行っていたんですか。映画を見てきました。良かったですか？ええ、まあまあでした。六。ジャズを聞きました。おかえりなさい。\n六。ジャズを聞きました。おかえりなさい。どこに行っていたんですか？ジャズを聞いてきました。よかったですか？ええ、まあまあでした。七、音楽会に行きました。おかえりなさい。どこに行っていたんですか。音楽会に行ってきました。よかった。ですか？ええ、まあまあでした。",
          "confidenceNote": "按0秒、35秒、70秒、108秒分段转写，原始文本保留重叠。segments按教材编号整理，统一标点及汉字写法；ASR将「例」识别为「零」。",
          "segments": [
            {
              "itemNumber": "1",
              "text": "甲：鈴木さんの家の電話番号が分かりませんね。\n乙：じゃあ、聞いてきましょうか。\n甲：ええ、お願いします。"
            },
            {
              "itemNumber": "2",
              "text": "甲：森さんが来ませんね。\n乙：じゃあ、電話をかけてきましょうか。\n甲：ええ、お願いします。"
            },
            {
              "itemNumber": "3",
              "text": "甲：のどが渇きましたね。\n乙：じゃあ、飲み物を買ってきましょうか。\n甲：ええ、お願いします。"
            },
            {
              "itemNumber": "4",
              "text": "甲：コップが汚いですね。\n乙：じゃあ、洗ってきましょうか。\n甲：ええ、お願いします。"
            },
            {
              "itemNumber": "5",
              "text": "甲：お帰りなさい。どこに行っていたんですか。\n乙：映画を見てきました。\n甲：よかったですか。\n乙：ええ、まあまあでした。"
            },
            {
              "itemNumber": "6",
              "text": "甲：お帰りなさい。どこに行っていたんですか。\n乙：ジャズを聞いてきました。\n甲：よかったですか。\n乙：ええ、まあまあでした。"
            },
            {
              "itemNumber": "7",
              "text": "甲：お帰りなさい。どこに行っていたんですか。\n乙：音楽会に行ってきました。\n甲：よかったですか。\n乙：ええ、まあまあでした。"
            }
          ]
        }
      }
    },
    {
      "id": "l39-p2-a1",
      "section": "practice_2",
      "order": 1,
      "title": "将（　　）中的词语变成适当的形式完成句子。",
      "instruction": "",
      "interaction": "fill_blank",
      "answerUnit": "word",
      "responseScope": "word_only",
      "layout": [
        {
          "type": "example",
          "content": {
            "label": "[例]",
            "after": [
              {
                "type": "text",
                "text": "そのニュースを（聞きます → 聞いて）、びっくりしました。",
                "kana": "そのニュースを（ききます → きいて）、びっくりしました。"
              }
            ],
            "afterKana": "そのニュースを（ききます → きいて）、びっくりしました。"
          }
        }
      ],
      "items": [
        {
          "id": "l39-p2-a1-q1",
          "number": "1",
          "prompt": [
            {
              "type": "text",
              "text": "携帯電話で（話します → ",
              "kana": "けいたいでんわで（はなします → "
            },
            {
              "type": "blank",
              "slotId": "answer",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）ながら歩かないでください。",
              "kana": "）ながらあるかないでください。"
            }
          ],
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "answer": {
            "slotValues": {
              "answer": "話し"
            }
          }
        },
        {
          "id": "l39-p2-a1-q2",
          "number": "2",
          "prompt": [
            {
              "type": "text",
              "text": "寒いので、コートを（着ます → ",
              "kana": "さむいので、コートを（きます → "
            },
            {
              "type": "blank",
              "slotId": "answer",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）出かけます。",
              "kana": "）でかけます。"
            }
          ],
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "answer": {
            "slotValues": {
              "answer": "着て"
            }
          }
        },
        {
          "id": "l39-p2-a1-q3",
          "number": "3",
          "prompt": [
            {
              "type": "text",
              "text": "お弁当を（買います → ",
              "kana": "おべんとうを（かいます → "
            },
            {
              "type": "blank",
              "slotId": "answer",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）帰って、家で食べました。",
              "kana": "）かえって、いえでたべました。"
            }
          ],
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "answer": {
            "slotValues": {
              "answer": "買って"
            }
          }
        },
        {
          "id": "l39-p2-a1-q4",
          "number": "4",
          "prompt": [
            {
              "type": "text",
              "text": "（飲みます → ",
              "kana": "（のみます → "
            },
            {
              "type": "blank",
              "slotId": "answer1",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）だら乗るな。（乗ります → ",
              "kana": "）だらのるな。（のります → "
            },
            {
              "type": "blank",
              "slotId": "answer2",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）なら飲むな。",
              "kana": "）ならのむな。"
            }
          ],
          "inputSlots": [
            {
              "id": "answer1",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            },
            {
              "id": "answer2",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "answer": {
            "slotValues": {
              "answer1": "飲ん",
              "answer2": "乗る"
            }
          }
        },
        {
          "id": "l39-p2-a1-q5",
          "number": "5",
          "prompt": [
            {
              "type": "text",
              "text": "つまらない本です。——じゃあ、（読みません → ",
              "kana": "つまらないほんです。——じゃあ、（よみません → "
            },
            {
              "type": "blank",
              "slotId": "answer",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）ことにします。",
              "kana": "）ことにします。"
            }
          ],
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "answer": {
            "slotValues": {
              "answer": "読まない"
            }
          }
        },
        {
          "id": "l39-p2-a1-q6",
          "number": "6",
          "prompt": [
            {
              "type": "text",
              "text": "明日、ピクニックに（行けません → ",
              "kana": "あした、ピクニックに（いけません → "
            },
            {
              "type": "blank",
              "slotId": "answer",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）かもしれません。",
              "kana": "）かもしれません。"
            }
          ],
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "answer": {
            "slotValues": {
              "answer": "行けない"
            }
          }
        },
        {
          "id": "l39-p2-a1-q7",
          "number": "7",
          "prompt": [
            {
              "type": "text",
              "text": "この薬を（飲みます → ",
              "kana": "このくすりを（のみます → "
            },
            {
              "type": "blank",
              "slotId": "answer",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）ば、すぐ治りますよ。",
              "kana": "）ば、すぐなおりますよ。"
            }
          ],
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "answer": {
            "slotValues": {
              "answer": "飲め"
            }
          }
        },
        {
          "id": "l39-p2-a1-q8",
          "number": "8",
          "prompt": [
            {
              "type": "text",
              "text": "午前中に予約を（します → ",
              "kana": "ごぜんちゅうによやくを（します → "
            },
            {
              "type": "blank",
              "slotId": "answer",
              "display": "underline"
            },
            {
              "type": "text",
              "text": "）こようと思います。",
              "kana": "）こようとおもいます。"
            }
          ],
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "conjugated_form",
              "width": "medium",
              "placeholder": "填写变形后的词语"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "answer": {
            "slotValues": {
              "answer": "して"
            }
          }
        }
      ]
    },
    {
      "id": "l39-p2-a2",
      "section": "practice_2",
      "order": 2,
      "title": "从a～e中选择合适的答案，将字母填入（　　）中。",
      "instruction": "",
      "interaction": "single_choice",
      "answerUnit": "choice",
      "responseScope": "choice_only",
      "layout": [
        {
          "type": "example",
          "content": {
            "label": "[例]",
            "after": [
              {
                "type": "text",
                "text": "馬さんは雨の中、傘を持たないで出かけました。（b）",
                "kana": "ばさんはあめのなか、かさをもたないででかけました。（b）"
              }
            ],
            "afterKana": "ばさんはあめのなか、かさをもたないででかけました。（b）"
          }
        },
        {
          "type": "word_bank",
          "words": [
            {
              "type": "text",
              "text": "a 馬さんはここにいません。",
              "kana": "a ばさんはここにいません。"
            },
            {
              "type": "text",
              "text": "b 馬さんはぬれました。",
              "kana": "b ばさんはぬれました。"
            },
            {
              "type": "text",
              "text": "c 馬さんの子供は、ここにいません。",
              "kana": "c ばさんのこどもは、ここにいません。"
            },
            {
              "type": "text",
              "text": "d 馬さんはここにいます。",
              "kana": "d ばさんはここにいます。"
            },
            {
              "type": "text",
              "text": "e 馬さんの子供は、今、ここにいます。",
              "kana": "e ばさんのこどもは、いま、ここにいます。"
            }
          ]
        }
      ],
      "items": [
        {
          "id": "l39-p2-a2-q1",
          "number": "1",
          "prompt": [
            {
              "type": "text",
              "text": "馬さんは手紙を出してきました。"
            }
          ],
          "promptKana": "ばさんはてがみをだしてきました。",
          "choices": [
            {
              "id": "a",
              "label": "a"
            },
            {
              "id": "b",
              "label": "b"
            },
            {
              "id": "c",
              "label": "c"
            },
            {
              "id": "d",
              "label": "d"
            },
            {
              "id": "e",
              "label": "e"
            }
          ],
          "answer": {
            "choiceIds": [
              "d"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        },
        {
          "id": "l39-p2-a2-q2",
          "number": "2",
          "prompt": [
            {
              "type": "text",
              "text": "馬さんは手紙を出しに行きました。"
            }
          ],
          "promptKana": "ばさんはてがみをだしにいきました。",
          "choices": [
            {
              "id": "a",
              "label": "a"
            },
            {
              "id": "b",
              "label": "b"
            },
            {
              "id": "c",
              "label": "c"
            },
            {
              "id": "d",
              "label": "d"
            },
            {
              "id": "e",
              "label": "e"
            }
          ],
          "answer": {
            "choiceIds": [
              "a"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        },
        {
          "id": "l39-p2-a2-q3",
          "number": "3",
          "prompt": [
            {
              "type": "text",
              "text": "馬さんは子供を連れてきました。"
            }
          ],
          "promptKana": "ばさんはこどもをつれてきました。",
          "choices": [
            {
              "id": "a",
              "label": "a"
            },
            {
              "id": "b",
              "label": "b"
            },
            {
              "id": "c",
              "label": "c"
            },
            {
              "id": "d",
              "label": "d"
            },
            {
              "id": "e",
              "label": "e"
            }
          ],
          "answer": {
            "choiceIds": [
              "e"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        },
        {
          "id": "l39-p2-a2-q4",
          "number": "4",
          "prompt": [
            {
              "type": "text",
              "text": "馬さんは子供を連れてきませんでした。"
            }
          ],
          "promptKana": "ばさんはこどもをつれてきませんでした。",
          "choices": [
            {
              "id": "a",
              "label": "a"
            },
            {
              "id": "b",
              "label": "b"
            },
            {
              "id": "c",
              "label": "c"
            },
            {
              "id": "d",
              "label": "d"
            },
            {
              "id": "e",
              "label": "e"
            }
          ],
          "answer": {
            "choiceIds": [
              "c"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        }
      ]
    },
    {
      "id": "l39-p2-a3",
      "section": "practice_2",
      "order": 3,
      "title": "给正确的答案画○。",
      "instruction": "",
      "interaction": "single_choice",
      "answerUnit": "choice",
      "responseScope": "choice_only",
      "layout": [
        {
          "type": "example",
          "content": {
            "label": "[例]",
            "after": [
              {
                "type": "text",
                "text": "この本は（"
              },
              {
                "type": "text",
                "text": "おもしろいから",
                "underline": true,
                "substitutionKey": "part1"
              },
              {
                "type": "text",
                "text": "・おもしろくて）、読んでください。"
              }
            ],
            "afterKana": "このほんは（おもしろいから・おもしろくて）、よんでください。"
          }
        }
      ],
      "items": [
        {
          "id": "l39-p2-a3-q1",
          "number": "1",
          "prompt": [
            {
              "type": "text",
              "text": "暑くて、（寝ません・全然寝られません）。"
            }
          ],
          "promptKana": "あつくて、（ねません・ぜんぜんねられません）。",
          "choices": [
            {
              "id": "choice1",
              "label": "寝ません"
            },
            {
              "id": "choice2",
              "label": "全然寝られません"
            }
          ],
          "answer": {
            "choiceIds": [
              "choice2"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        },
        {
          "id": "l39-p2-a3-q2",
          "number": "2",
          "prompt": [
            {
              "type": "text",
              "text": "（暇で・暇だから）、行きます。"
            }
          ],
          "promptKana": "（ひまで・ひまだから）、いきます。",
          "choices": [
            {
              "id": "choice1",
              "label": "暇で"
            },
            {
              "id": "choice2",
              "label": "暇だから"
            }
          ],
          "answer": {
            "choiceIds": [
              "choice2"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        },
        {
          "id": "l39-p2-a3-q3",
          "number": "3",
          "prompt": [
            {
              "type": "text",
              "text": "事故が（あったために・あるために）、遅れました。"
            }
          ],
          "promptKana": "じこが（あったために・あるために）、おくれました。",
          "choices": [
            {
              "id": "choice1",
              "label": "あったために"
            },
            {
              "id": "choice2",
              "label": "あるために"
            }
          ],
          "answer": {
            "choiceIds": [
              "choice1"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        },
        {
          "id": "l39-p2-a3-q4",
          "number": "4",
          "prompt": [
            {
              "type": "text",
              "text": "（おいしくて・おいしくても）、たくさん食べてしまいました。"
            }
          ],
          "promptKana": "（おいしくて・おいしくても）、たくさんたべてしまいました。",
          "choices": [
            {
              "id": "choice1",
              "label": "おいしくて"
            },
            {
              "id": "choice2",
              "label": "おいしくても"
            }
          ],
          "answer": {
            "choiceIds": [
              "choice1"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        },
        {
          "id": "l39-p2-a3-q5",
          "number": "5",
          "prompt": [
            {
              "type": "text",
              "text": "これは音が（悪いために・悪いから）、会議では使わないでください。"
            }
          ],
          "promptKana": "これはおとが（わるいために・わるいから）、かいぎではつかわないでください。",
          "choices": [
            {
              "id": "choice1",
              "label": "悪いために"
            },
            {
              "id": "choice2",
              "label": "悪いから"
            }
          ],
          "answer": {
            "choiceIds": [
              "choice2"
            ]
          },
          "answerSource": "prompt",
          "evaluationMode": "exact"
        }
      ]
    },
    {
      "id": "l39-p2-a4",
      "section": "practice_2",
      "order": 4,
      "title": "将下面的句子译成日语。",
      "instruction": "",
      "interaction": "translation",
      "answerUnit": "sentence",
      "responseScope": "sentence_only",
      "layout": [],
      "items": [
        {
          "id": "l39-p2-a4-q1",
          "number": "1",
          "prompt": [
            {
              "type": "text",
              "text": "森先生带伞了吗？——没有。没带〈就出去了〉。"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "dialogue",
              "width": "long",
              "multiline": true,
              "rows": 4,
              "placeholder": "填写完整对话"
            }
          ],
          "answer": {
            "slotValues": {
              "answer": "甲：森さんは傘を持っていきましたか。\n乙：いいえ、持たないで出かけました。"
            }
          },
          "responseScope": "question_and_answer",
          "responseScopeHint": "填写问句和回答两行完整对话。"
        },
        {
          "id": "l39-p2-a4-q2",
          "number": "2",
          "prompt": [
            {
              "type": "text",
              "text": "因为〈道路〉施工，道路非常拥堵。"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "sentence",
              "width": "long",
              "placeholder": "填写完整句子"
            }
          ],
          "answer": {
            "slotValues": {
              "answer": "道路工事のために、道が込んでいます。"
            }
          }
        },
        {
          "id": "l39-p2-a4-q3",
          "number": "3",
          "prompt": [
            {
              "type": "text",
              "text": "去年，在日本看了歌舞伎。"
            }
          ],
          "answerSource": "prompt",
          "evaluationMode": "exact",
          "inputSlots": [
            {
              "id": "answer",
              "expectedUnit": "sentence",
              "width": "long",
              "placeholder": "填写完整句子"
            }
          ],
          "answer": {
            "slotValues": {
              "answer": "去年、日本で歌舞伎を見てきました。"
            }
          }
        }
      ]
    }
  ]
};
