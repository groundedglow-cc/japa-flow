import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson3/page${pageNo}.webp`;

const pages: LessonImageCropCatalog["pages"] = [
  {
    pageNo: 48,
    imagePath: page(48),
    assets: [
      {
        id: "l3-p1-a1-place-picture-practice",
        kind: "table",
        imagePath: page(48),
        label: "练习 I · 1 场所图片",
        crop: { unit: "percent", x: 12.1, y: 16.0, width: 78.9, height: 30.4, aspectRatio: 1.73 },
        meta: { pageNo: 48, source: "manual-adjusted-after-auto-crop" }
      },
      {
        id: "l3-p1-a1-building-picture-practice",
        kind: "map",
        imagePath: page(48),
        label: "练习 I · 1 楼层图",
        crop: { unit: "percent", x: 15.0, y: 39.7, width: 35.5, height: 28.5, aspectRatio: 0.83 },
        meta: { pageNo: 48, source: "manual-adjusted-after-auto-crop" }
      }
    ]
  },
  {
    pageNo: 49,
    imagePath: page(49),
    assets: [
      {
        id: "l3-p1-a6-price-picture-practice",
        kind: "table",
        imagePath: page(49),
        label: "练习 I · 6 商品价格图",
        crop: { unit: "percent", x: 3.8, y: 47.8, width: 57.9, height: 29.7, aspectRatio: 1.3 },
        meta: {
          pageNo: 49,
          source: "manual-merged-from-auto-row-band",
          autoDetectedIds: "lesson3-page49-rb0,lesson3-page49-rb1"
        }
      }
    ]
  },
  {
    pageNo: 50,
    imagePath: page(50),
    assets: [
      {
        id: "l3-p2-a3-stamp-picture-practice",
        kind: "table",
        imagePath: page(50),
        label: "练习 II · 3 邮票价格图",
        crop: { unit: "percent", x: 10.0, y: 47.3, width: 87.2, height: 18.8, aspectRatio: 3.09 },
        meta: { pageNo: 50, source: "manual-adjusted-after-auto-crop" }
      }
    ]
  }
];

export const lesson3ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson3",
  sourceDir: "../course-assets/by-lesson/lesson3",
  selectedImages: ["page48.webp", "page49.webp", "page50.webp"],
  pages,
  assets: pages.flatMap((pageEntry) => pageEntry.assets)
};
