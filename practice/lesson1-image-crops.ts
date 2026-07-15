import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson1/page${pageNo}.webp`;

export const lesson1ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson1",
  sourceDir: "../course-assets/by-lesson/lesson1",
  selectedImages: ["page28.webp"],
  pages: [
    {
      pageNo: 28,
      imagePath: page(28),
      assets: [
        {
          id: "l1-p1-a4-person-cards",
          kind: "table",
          imagePath: page(28),
          label: "练习 I 4 人物信息图",
          crop: { unit: "percent", x: 9.92, y: 69.25, width: 86.87, height: 18.38, aspectRatio: 3.1293 },
          meta: { pageNo: 28, pixelX: 105, pixelY: 1108, pixelWidth: 920, pixelHeight: 294 }
        }
      ]
    }
  ],
  assets: []
};

lesson1ImageCrops.assets = lesson1ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
