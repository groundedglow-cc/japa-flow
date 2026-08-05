import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson7/page${pageNo}.webp`;

export const lesson7ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson7",
  sourceDir: "../course-assets/by-lesson/lesson7",
  selectedImages: ["page94.webp", "page95.webp", "page96.webp"],
  pages: [
    {
      pageNo: 94,
      imagePath: page(94),
      assets: [
        {
          id: "l7-p1-a1-action-cards",
          kind: "source_crop",
          imagePath: page(94),
          label: "练习 I 1 动作替换图",
          crop: { unit: "percent", x: 9.82, y: 15.88, width: 87.91, height: 16.88, aspectRatio: 3.2552 },
          meta: { pageNo: 94, pixelX: 104, pixelY: 254, pixelWidth: 931, pixelHeight: 270 }
        }
      ]
    },
    {
      pageNo: 95,
      imagePath: page(95),
      assets: [
        {
          id: "l7-p1-a5-daily-schedules",
          kind: "source_crop",
          imagePath: page(95),
          label: "练习 I 5 一天日程图",
          crop: { unit: "percent", x: 3.4, y: 6.56, width: 90.84, height: 46.06, aspectRatio: 1.3054 },
          meta: { pageNo: 95, pixelX: 36, pixelY: 105, pixelWidth: 962, pixelHeight: 737 }
        },
        {
          id: "l7-p1-a6-shop-items",
          kind: "source_crop",
          imagePath: page(95),
          label: "练习 I 6 购物角色扮演图",
          crop: { unit: "percent", x: 3.49, y: 68.63, width: 87.35, height: 12.94, aspectRatio: 4.4698 },
          meta: { pageNo: 95, pixelX: 37, pixelY: 1098, pixelWidth: 925, pixelHeight: 207 }
        }
      ]
    },
    {
      pageNo: 96,
      imagePath: page(96),
      assets: [
        {
          id: "l7-p2-a2-picture-prompts",
          kind: "source_crop",
          imagePath: page(96),
          label: "练习 II 2 看图完成句子图",
          crop: { unit: "percent", x: 9.73, y: 30.5, width: 86.87, height: 14.19, aspectRatio: 3.8271 },
          meta: { pageNo: 96, pixelX: 103, pixelY: 488, pixelWidth: 920, pixelHeight: 227 }
        }
      ]
    }
  ],
  assets: []
};

lesson7ImageCrops.assets = lesson7ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
