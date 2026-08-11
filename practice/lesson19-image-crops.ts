import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson19/page${pageNo}.webp`;

export const lesson19ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson19",
  sourceDir: "../course-assets/by-lesson/lesson19",
  selectedImages: ["page232.webp", "page233.webp", "page234.webp"],
  pages: [
    {
      pageNo: 232,
      imagePath: page(232),
      assets: [
        {
          id: "l19-p1-a1-masu-nai-table",
          kind: "source_crop",
          imagePath: page(232),
          label: "练习 I 1 ます形/ない形表",
          crop: { unit: "percent", x: 8.88, y: 16.38, width: 86.5, height: 24.25, aspectRatio: 2.3605 },
          meta: { pageNo: 232, pixelX: 94, pixelY: 262, pixelWidth: 916, pixelHeight: 388 }
        },
        {
          id: "l19-p1-a2-prohibition-picture-strip",
          kind: "source_crop",
          imagePath: page(232),
          label: "练习 I 2 禁止事项图片",
          crop: { unit: "percent", x: 8.88, y: 45.5, width: 86.5, height: 15.0, aspectRatio: 3.8167 },
          meta: { pageNo: 232, pixelX: 94, pixelY: 728, pixelWidth: 916, pixelHeight: 240 }
        },
        {
          id: "l19-p1-a3-page232",
          kind: "source_crop",
          imagePath: page(232),
          label: "练习 I 3 前半",
          crop: { unit: "percent", x: 8.5, y: 68.0, width: 88.0, height: 22.0, aspectRatio: 2.6477 },
          meta: { pageNo: 232, pixelX: 90, pixelY: 1088, pixelWidth: 932, pixelHeight: 352 }
        }
      ]
    },
    {
      pageNo: 233,
      imagePath: page(233),
      assets: [
        {
          id: "l19-p1-a3-page233",
          kind: "source_crop",
          imagePath: page(233),
          label: "练习 I 3 后半",
          crop: { unit: "percent", x: 3.5, y: 5.25, width: 92.0, height: 14.5, aspectRatio: 4.2032 },
          meta: { pageNo: 233, pixelX: 37, pixelY: 84, pixelWidth: 974, pixelHeight: 232 }
        },
        {
          id: "l19-p1-a4-dialogue",
          kind: "source_crop",
          imagePath: page(233),
          label: "练习 I 4 会话替换",
          crop: { unit: "percent", x: 3.5, y: 21.0, width: 92.0, height: 31.5, aspectRatio: 1.9321 },
          meta: { pageNo: 233, pixelX: 37, pixelY: 336, pixelWidth: 974, pixelHeight: 504 }
        },
        {
          id: "l19-p1-a5-dialogue",
          kind: "source_crop",
          imagePath: page(233),
          label: "练习 I 5 会话替换",
          crop: { unit: "percent", x: 3.5, y: 55.5, width: 92.0, height: 32.0, aspectRatio: 1.9039 },
          meta: { pageNo: 233, pixelX: 37, pixelY: 888, pixelWidth: 974, pixelHeight: 512 }
        }
      ]
    },
    {
      pageNo: 234,
      imagePath: page(234),
      assets: [
        {
          id: "l19-p2-a1-schedule",
          kind: "source_crop",
          imagePath: page(234),
          label: "练习 II 1 日程表",
          crop: { unit: "percent", x: 8.78, y: 12.25, width: 87.35, height: 26.75, aspectRatio: 2.1637 },
          meta: { pageNo: 234, pixelX: 93, pixelY: 196, pixelWidth: 925, pixelHeight: 428 }
        },
        {
          id: "l19-p2-a2-word-bank",
          kind: "source_crop",
          imagePath: page(234),
          label: "练习 II 2 词语选择",
          crop: { unit: "percent", x: 8.5, y: 42.5, width: 87.0, height: 20.5, aspectRatio: 2.8095 },
          meta: { pageNo: 234, pixelX: 90, pixelY: 680, pixelWidth: 921, pixelHeight: 328 }
        },
        {
          id: "l19-p2-a3-listening-cloze",
          kind: "source_crop",
          imagePath: page(234),
          label: "练习 II 3 听录音填空",
          crop: { unit: "percent", x: 8.5, y: 66.0, width: 86.5, height: 17.5, aspectRatio: 3.2716 },
          meta: { pageNo: 234, pixelX: 90, pixelY: 1056, pixelWidth: 916, pixelHeight: 280 }
        },
        {
          id: "l19-p2-a4-translation",
          kind: "source_crop",
          imagePath: page(234),
          label: "练习 II 4 翻译",
          crop: { unit: "percent", x: 8.5, y: 87.5, width: 86.5, height: 8.0, aspectRatio: 7.2031 },
          meta: { pageNo: 234, pixelX: 90, pixelY: 1400, pixelWidth: 916, pixelHeight: 128 }
        }
      ]
    }
  ],
  assets: []
};

lesson19ImageCrops.assets = lesson19ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
