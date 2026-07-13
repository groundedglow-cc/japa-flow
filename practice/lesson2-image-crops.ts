import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson2/page${pageNo}.webp`;

const pages: LessonImageCropCatalog["pages"] = [
  {
    pageNo: 38,
    imagePath: page(38),
    assets: [
      {
        id: "l2-p1-a1-picture-practice",
        kind: "table",
        imagePath: page(38),
        label: "练习 I · 1 看图替换",
        crop: { unit: "percent", x: 8.5, y: 16.2, width: 87.8, height: 31.4, aspectRatio: 1.875 },
        meta: { pageNo: 38 }
      }
    ]
  },
  {
    pageNo: 39,
    imagePath: page(39),
    assets: [
      {
        id: "l2-p1-a4-picture-practice",
        kind: "table",
        imagePath: page(39),
        label: "练习 I · 4 看图会话",
        crop: { unit: "percent", x: 6.2, y: 8.1, width: 87.9, height: 42.3, aspectRatio: 1.395 },
        meta: { pageNo: 39 }
      }
    ]
  },
  {
    pageNo: 40,
    imagePath: page(40),
    assets: [
      {
        id: "l2-p2-a4-picture-practice",
        kind: "table",
        imagePath: page(40),
        label: "练习 II · 4 看图听录音",
        crop: { unit: "percent", x: 7.6, y: 60.7, width: 87.1, height: 16.2, aspectRatio: 3.61 },
        meta: { pageNo: 40 }
      }
    ]
  }
];

export const lesson2ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson2",
  sourceDir: "../course-assets/by-lesson/lesson2",
  selectedImages: ["page38.webp", "page39.webp", "page40.webp"],
  pages,
  assets: pages.flatMap((pageEntry) => pageEntry.assets)
};
