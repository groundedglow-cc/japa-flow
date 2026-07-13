import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson6/page${pageNo}.webp`;

export const lesson6ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson6",
  sourceDir: "../course-assets/by-lesson/lesson6",
  selectedImages: ["page85.webp", "page86.webp"],
  pages: [
    {
      pageNo: 85,
      imagePath: page(85),
      assets: [
        {
          id: "l6-p1-a6-trip-scenes",
          kind: "scene",
          imagePath: page(85),
          label: "练习 I 6 看图组句图",
          crop: { unit: "percent", x: 4.72, y: 20.63, width: 86.02, height: 53.13, aspectRatio: 1.0718 },
          meta: { pageNo: 85, pixelX: 50, pixelY: 330, pixelWidth: 911, pixelHeight: 850 }
        }
      ]
    },
    {
      pageNo: 86,
      imagePath: page(86),
      assets: [
        {
          id: "l6-p2-a2-bus-routes",
          kind: "table",
          imagePath: page(86),
          label: "练习 II 2 公交线路表",
          crop: { unit: "percent", x: 5.95, y: 20.94, width: 88.95, height: 11.56, aspectRatio: 5.0919 },
          meta: { pageNo: 86, pixelX: 63, pixelY: 335, pixelWidth: 942, pixelHeight: 185 }
        }
      ]
    }
  ],
  assets: []
};

lesson6ImageCrops.assets = lesson6ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
