import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson8/page${pageNo}.webp`;

export const lesson8ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson8",
  sourceDir: "../course-assets/by-lesson/lesson8",
  selectedImages: ["page104.webp", "page105.webp"],
  pages: [
    {
      pageNo: 104,
      imagePath: page(104),
      assets: [
        {
          id: "l8-p1-a3-gift-scenes",
          kind: "source_crop",
          imagePath: page(104),
          label: "练习 I 3 授受会话图",
          crop: { unit: "percent", x: 8.59, y: 46.81, width: 87.25, height: 17.56, aspectRatio: 3.1053 },
          meta: { pageNo: 104, pixelX: 91, pixelY: 749, pixelWidth: 924, pixelHeight: 281 }
        }
      ]
    },
    {
      pageNo: 105,
      imagePath: page(105),
      assets: [
        {
          id: "l8-p1-a7-completion-table",
          kind: "table",
          imagePath: page(105),
          label: "练习 I 7 完成情况表",
          crop: { unit: "percent", x: 5.0, y: 65.31, width: 63.83, height: 20.25, aspectRatio: 1.9691 },
          meta: { pageNo: 105, pixelX: 53, pixelY: 1045, pixelWidth: 676, pixelHeight: 324 }
        }
      ]
    }
  ],
  assets: []
};

lesson8ImageCrops.assets = lesson8ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
