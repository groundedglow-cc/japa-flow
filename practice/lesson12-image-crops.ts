import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson12/page${pageNo}.webp`;

export const lesson12ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson12",
  sourceDir: "../course-assets/by-lesson/lesson12",
  selectedImages: ["page150.webp", "page151.webp", "page152.webp"],
  pages: [
    {
      pageNo: 150,
      imagePath: page(150),
      assets: [
        {
          id: "l12-p1-a2-comparison-pictures-group1",
          kind: "source_crop",
          imagePath: page(150),
          label: "练习 I 2 比较图组 1",
          crop: { unit: "percent", x: 9.07, y: 29.13, width: 87.06, height: 21.19, aspectRatio: 2.7183 },
          meta: { pageNo: 150, pixelX: 96, pixelY: 466, pixelWidth: 922, pixelHeight: 339 }
        },
        {
          id: "l12-p1-a2-comparison-pictures-group2",
          kind: "source_crop",
          imagePath: page(150),
          label: "练习 I 2 比较图组 2",
          crop: { unit: "percent", x: 9.44, y: 57.13, width: 86.59, height: 22.63, aspectRatio: 2.5318 },
          meta: { pageNo: 150, pixelX: 100, pixelY: 914, pixelWidth: 917, pixelHeight: 362 }
        }
      ]
    },
    {
      pageNo: 151,
      imagePath: page(151),
      assets: []
    },
    {
      pageNo: 152,
      imagePath: page(152),
      assets: [
        {
          id: "l12-p2-a2-tokyo-temperature-chart",
          kind: "table",
          imagePath: page(152),
          label: "练习 II 2 东京平均气温图",
          crop: { unit: "percent", x: 23.13, y: 19.88, width: 62.8, height: 30.44, aspectRatio: 1.3655 },
          meta: { pageNo: 152, pixelX: 245, pixelY: 318, pixelWidth: 665, pixelHeight: 487 }
        }
      ]
    }
  ],
  assets: []
};

lesson12ImageCrops.assets = lesson12ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
