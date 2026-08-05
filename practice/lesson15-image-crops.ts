import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson15/page${pageNo}.webp`;

export const lesson15ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson15",
  sourceDir: "../course-assets/by-lesson/lesson15",
  selectedImages: ["page186.webp", "page187.webp", "page188.webp"],
  pages: [
    {
      pageNo: 186,
      imagePath: page(186),
      assets: [
        {
          id: "l15-p1-a1-current-action-picture",
          kind: "source_crop",
          imagePath: page(186),
          label: "练习 I 1 动作图",
          crop: { unit: "percent", x: 10.2, y: 15.88, width: 87.25, height: 28.56, aspectRatio: 2.022 },
          meta: { pageNo: 186, pixelX: 108, pixelY: 254, pixelWidth: 924, pixelHeight: 457 }
        },
        {
          id: "l15-p1-a2-te-form-classification-chart",
          kind: "source_crop",
          imagePath: page(186),
          label: "练习 I 2 て形分类图",
          crop: { unit: "percent", x: 10.39, y: 53.63, width: 84.51, height: 35, aspectRatio: 1.5982 },
          meta: { pageNo: 186, pixelX: 110, pixelY: 858, pixelWidth: 895, pixelHeight: 560 }
        }
      ]
    },
    {
      pageNo: 187,
      imagePath: page(187),
      assets: []
    },
    {
      pageNo: 188,
      imagePath: page(188),
      assets: []
    }
  ],
  assets: []
};

lesson15ImageCrops.assets = lesson15ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
