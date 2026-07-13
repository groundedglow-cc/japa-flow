import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson5/page${pageNo}.webp`;

export const lesson5ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson5",
  sourceDir: "../course-assets/by-lesson/lesson5",
  selectedImages: ["page74.webp", "page76.webp"],
  pages: [
    {
      pageNo: 74,
      imagePath: page(74),
      assets: [
        {
          id: "l5-p1-a1-clock-set",
          kind: "table",
          imagePath: page(74),
          label: "练习 I 1 [例1] 时钟图",
          crop: { unit: "percent", x: 6.8, y: 16.0, width: 90.5, height: 25.0, aspectRatio: 2.395 },
          meta: { pageNo: 74, pixelX: 72, pixelY: 256, pixelWidth: 958, pixelHeight: 400 }
        },
        {
          id: "l5-p1-a1-digital-set",
          kind: "table",
          imagePath: page(74),
          label: "练习 I 1 [例2] 电子表图",
          crop: { unit: "percent", x: 7.0, y: 43.75, width: 88.9, height: 10.0, aspectRatio: 5.8938 },
          meta: { pageNo: 74, pixelX: 74, pixelY: 700, pixelWidth: 941, pixelHeight: 160 }
        }
      ]
    },
    {
      pageNo: 76,
      imagePath: page(76),
      assets: [
        {
          id: "l5-p2-a2-calendar",
          kind: "table",
          imagePath: page(76),
          label: "练习 II 2 日历表",
          crop: { unit: "percent", x: 5.5, y: 21.88, width: 90.65, height: 26.25, aspectRatio: 2.2857 },
          meta: { pageNo: 76, pixelX: 58, pixelY: 350, pixelWidth: 960, pixelHeight: 420 }
        }
      ]
    }
  ],
  assets: []
};

lesson5ImageCrops.assets = lesson5ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
