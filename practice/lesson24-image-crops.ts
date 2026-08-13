import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson24/page${pageNo}.webp`;

export const lesson24ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson24",
  sourceDir: "../course-assets/by-lesson/lesson24",
  selectedImages: ["page288.webp", "page289.webp", "page290.webp"],
  pages: [
    {
      pageNo: 288,
      imagePath: page(288),
      assets: [
        {
          id: "l24-p1-a1-transform",
          kind: "source_crop",
          imagePath: page(288),
          label: "练习 I 1 と 思います转换",
          crop: { unit: "percent", x: 6.0, y: 12.2, width: 88.4, height: 27.5, aspectRatio: 2.008 },
          meta: { pageNo: 288 }
        },
        {
          id: "l24-p1-a2-answer-question",
          kind: "source_crop",
          imagePath: page(288),
          label: "练习 I 2 回答提问",
          crop: { unit: "percent", x: 6.0, y: 40.2, width: 88.4, height: 25.0, aspectRatio: 2.340 },
          meta: { pageNo: 288 }
        },
        {
          id: "l24-p1-a3-listening-answer",
          kind: "source_crop",
          imagePath: page(288),
          label: "练习 I 3 听录音回答",
          crop: { unit: "percent", x: 6.0, y: 66.0, width: 88.4, height: 20.5, aspectRatio: 2.854 },
          meta: { pageNo: 288 }
        },
        {
          id: "l24-p1-a4-report-speech",
          kind: "source_crop",
          imagePath: page(288),
          label: "练习 I 4 转述",
          crop: { unit: "percent", x: 6.0, y: 87.2, width: 88.4, height: 7.0, aspectRatio: 8.358 },
          meta: { pageNo: 288 }
        }
      ]
    },
    {
      pageNo: 289,
      imagePath: page(289),
      assets: [
        {
          id: "l24-p1-a4-report-speech-cont",
          kind: "source_crop",
          imagePath: page(289),
          label: "练习 I 4 转述续",
          crop: { unit: "percent", x: 2.5, y: 5.5, width: 88.4, height: 13.5, aspectRatio: 4.334 },
          meta: { pageNo: 289 }
        },
        {
          id: "l24-p1-a5-nodesu-transform",
          kind: "source_crop",
          imagePath: page(289),
          label: "练习 I 5 んです转换",
          crop: { unit: "percent", x: 6.0, y: 20.5, width: 88.4, height: 28.0, aspectRatio: 2.089 },
          meta: { pageNo: 289 }
        },
        {
          id: "l24-p1-a6-request-transform",
          kind: "source_crop",
          imagePath: page(289),
          label: "练习 I 6 请求表达",
          crop: { unit: "percent", x: 6.0, y: 51.0, width: 88.4, height: 24.0, aspectRatio: 2.438 },
          meta: { pageNo: 289 }
        },
        {
          id: "l24-p1-a7-dialogue",
          kind: "source_crop",
          imagePath: page(289),
          label: "练习 I 7 んです会话",
          crop: { unit: "percent", x: 6.0, y: 77.0, width: 88.4, height: 18.0, aspectRatio: 3.251 },
          meta: { pageNo: 289 }
        }
      ]
    },
    {
      pageNo: 290,
      imagePath: page(290),
      assets: [
        {
          id: "l24-p2-a1-word-bank",
          kind: "source_crop",
          imagePath: page(290),
          label: "练习 II 1 词框填空",
          crop: { unit: "percent", x: 6.0, y: 8.2, width: 88.4, height: 25.0, aspectRatio: 2.340 },
          meta: { pageNo: 290 }
        },
        {
          id: "l24-p2-a2-transform",
          kind: "source_crop",
          imagePath: page(290),
          label: "练习 II 2 んです填空",
          crop: { unit: "percent", x: 6.0, y: 36.0, width: 88.4, height: 22.0, aspectRatio: 2.660 },
          meta: { pageNo: 290 }
        },
        {
          id: "l24-p2-a3-listening-choice",
          kind: "source_crop",
          imagePath: page(290),
          label: "练习 II 3 听录音选句子",
          crop: { unit: "percent", x: 6.0, y: 59.5, width: 88.4, height: 24.5, aspectRatio: 2.388 },
          meta: { pageNo: 290 }
        },
        {
          id: "l24-p2-a4-translation",
          kind: "source_crop",
          imagePath: page(290),
          label: "练习 II 4 翻译",
          crop: { unit: "percent", x: 6.0, y: 84.5, width: 88.4, height: 10.0, aspectRatio: 5.852 },
          meta: { pageNo: 290 }
        }
      ]
    }
  ],
  assets: []
};

lesson24ImageCrops.assets = lesson24ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
