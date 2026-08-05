import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson13/page${pageNo}.webp`;

export const lesson13ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson13",
  sourceDir: "../course-assets/by-lesson/lesson13",
  selectedImages: ["page166.webp", "page167.webp", "page168.webp"],
  pages: [
    {
      pageNo: 166,
      imagePath: page(166),
      assets: [
        {
          id: "l13-p1-a1-fruit-count-pictures",
          kind: "source_crop",
          imagePath: page(166),
          label: "练习 I 1 个数图",
          crop: { unit: "percent", x: 7.55, y: 15.63, width: 90.18, height: 14.38, aspectRatio: 4.1522 },
          meta: { pageNo: 166, pixelX: 80, pixelY: 250, pixelWidth: 955, pixelHeight: 230 }
        },
        {
          id: "l13-p1-a2-counter-pictures",
          kind: "source_crop",
          imagePath: page(166),
          label: "练习 I 2 量词图",
          crop: { unit: "percent", x: 8.03, y: 35, width: 89.71, height: 40.94, aspectRatio: 1.4519 },
          meta: { pageNo: 166, pixelX: 85, pixelY: 560, pixelWidth: 950, pixelHeight: 655 }
        }
      ]
    },
    {
      pageNo: 167,
      imagePath: page(167),
      assets: []
    },
    {
      pageNo: 168,
      imagePath: page(168),
      assets: [
        {
          id: "l13-p2-a4-weekly-schedule",
          kind: "table",
          imagePath: page(168),
          label: "练习 II 4 小张一周日程表",
          crop: { unit: "percent", x: 8.31, y: 62.5, width: 88.76, height: 14.06, aspectRatio: 4.1778 },
          meta: { pageNo: 168, pixelX: 88, pixelY: 1000, pixelWidth: 940, pixelHeight: 225 }
        }
      ]
    }
  ],
  assets: []
};

lesson13ImageCrops.assets = lesson13ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
