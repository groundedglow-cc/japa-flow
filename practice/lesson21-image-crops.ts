import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson21/page${pageNo}.webp`;

export const lesson21ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson21",
  sourceDir: "../course-assets/by-lesson/lesson21",
  selectedImages: ["page258.webp", "page259.webp", "page260.webp"],
  pages: [
    {
      pageNo: 258,
      imagePath: page(258),
      assets: [
        {
          id: "l21-p1-a1-ta-form-table",
          kind: "source_crop",
          imagePath: page(258),
          label: "练习 I 1 ます形/た形表",
          crop: { unit: "percent", x: 6.8, y: 13.3, width: 89.6, height: 32.0, aspectRatio: 1.852 },
          meta: { pageNo: 258, pixelX: 72, pixelY: 213, pixelWidth: 949, pixelHeight: 512 }
        },
        {
          id: "l21-p1-a2-picture-sequence",
          kind: "source_crop",
          imagePath: page(258),
          label: "练习 I 2 前后顺序图片",
          crop: { unit: "percent", x: 6.8, y: 48.2, width: 89.6, height: 36.0, aspectRatio: 1.647 },
          meta: { pageNo: 258, pixelX: 72, pixelY: 771, pixelWidth: 949, pixelHeight: 576 }
        }
      ]
    },
    {
      pageNo: 259,
      imagePath: page(259),
      assets: [
        {
          id: "l21-p1-a3-experience-after",
          kind: "source_crop",
          imagePath: page(259),
          label: "练习 I 3 经验/后で替换",
          crop: { unit: "percent", x: 6.6, y: 6.7, width: 86.8, height: 20.5, aspectRatio: 2.803 },
          meta: { pageNo: 259, pixelX: 70, pixelY: 107, pixelWidth: 919, pixelHeight: 328 }
        },
        {
          id: "l21-p1-a4-advice-offer",
          kind: "source_crop",
          imagePath: page(259),
          label: "练习 I 4 ほうがいい/ましょうか",
          crop: { unit: "percent", x: 6.6, y: 28.0, width: 86.8, height: 22.7, aspectRatio: 2.53 },
          meta: { pageNo: 259, pixelX: 70, pixelY: 448, pixelWidth: 919, pixelHeight: 363 }
        },
        {
          id: "l21-p1-a5-experience-dialogue",
          kind: "source_crop",
          imagePath: page(259),
          label: "练习 I 5 经验会话",
          crop: { unit: "percent", x: 6.6, y: 53.0, width: 86.8, height: 18.8, aspectRatio: 3.08 },
          meta: { pageNo: 259, pixelX: 70, pixelY: 848, pixelWidth: 919, pixelHeight: 301 }
        },
        {
          id: "l21-p1-a6-reason-advice",
          kind: "source_crop",
          imagePath: page(259),
          label: "练习 I 6 原因与建议",
          crop: { unit: "percent", x: 6.6, y: 75.0, width: 86.8, height: 16.5, aspectRatio: 3.497 },
          meta: { pageNo: 259, pixelX: 70, pixelY: 1200, pixelWidth: 919, pixelHeight: 264 }
        }
      ]
    },
    {
      pageNo: 260,
      imagePath: page(260),
      assets: [
        {
          id: "l21-p2-a1-cloze",
          kind: "source_crop",
          imagePath: page(260),
          label: "练习 II 1 词形填空",
          crop: { unit: "percent", x: 6.8, y: 9.4, width: 86.7, height: 20.8, aspectRatio: 2.754 },
          meta: { pageNo: 260, pixelX: 72, pixelY: 150, pixelWidth: 918, pixelHeight: 333 }
        },
        {
          id: "l21-p2-a2-advice-cloze",
          kind: "source_crop",
          imagePath: page(260),
          label: "练习 II 2 建议填空",
          crop: { unit: "percent", x: 6.8, y: 33.0, width: 86.7, height: 24.5, aspectRatio: 2.212 },
          meta: { pageNo: 260, pixelX: 72, pixelY: 528, pixelWidth: 918, pixelHeight: 392 }
        },
        {
          id: "l21-p2-a3-true-false",
          kind: "source_crop",
          imagePath: page(260),
          label: "练习 II 3 听录音判断",
          crop: { unit: "percent", x: 6.8, y: 60.5, width: 86.7, height: 22.5, aspectRatio: 2.55 },
          meta: { pageNo: 260, pixelX: 72, pixelY: 968, pixelWidth: 918, pixelHeight: 360 }
        },
        {
          id: "l21-p2-a4-translation",
          kind: "source_crop",
          imagePath: page(260),
          label: "练习 II 4 翻译",
          crop: { unit: "percent", x: 6.8, y: 86.0, width: 72.0, height: 9.0, aspectRatio: 5.294 },
          meta: { pageNo: 260, pixelX: 72, pixelY: 1376, pixelWidth: 762, pixelHeight: 144 }
        }
      ]
    }
  ],
  assets: []
};

lesson21ImageCrops.assets = lesson21ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
