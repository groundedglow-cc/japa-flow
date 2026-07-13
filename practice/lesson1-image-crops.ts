import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson1/page${pageNo}.webp`;

const pages: LessonImageCropCatalog["pages"] = [
  {
    pageNo: 28,
    imagePath: page(28),
    assets: [
      {
        id: "l1-p1-a4-picture-practice",
        kind: "table",
        imagePath: page(28),
        label: "练习 I · 4 看图练习",
        crop: { unit: "percent", x: 9.92, y: 69.25, width: 86.87, height: 18.38, aspectRatio: 3.1293 },
        meta: { pageNo: 28, rowBand: 0, pixelX: 105, pixelY: 1108, pixelWidth: 920, pixelHeight: 294 }
      }
    ]
  }
];

export const lesson1ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson1",
  sourceDir: "../course-assets/by-lesson/lesson1",
  pages,
  assets: pages.flatMap((pageEntry) => pageEntry.assets)
};
