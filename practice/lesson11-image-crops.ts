import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson11/page${pageNo}.webp`;

export const lesson11ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson11",
  sourceDir: "../course-assets/by-lesson/lesson11",
  selectedImages: ["page140.webp", "page141.webp", "page142.webp"],
  pages: [
    {
      pageNo: 140,
      imagePath: page(140),
      assets: [
        {
          id: "l11-p1-a2-ability-preference-picture-prompts",
          kind: "source_crop",
          imagePath: page(140),
          label: "练习 I 2 好恶与能力图",
          crop: { unit: "percent", x: 8.59, y: 35.75, width: 87.44, height: 17.5, aspectRatio: 3.3071 },
          meta: { pageNo: 140, pixelX: 91, pixelY: 572, pixelWidth: 926, pixelHeight: 280 }
        }
      ]
    },
    {
      pageNo: 141,
      imagePath: page(141),
      assets: [
        {
          id: "l11-p1-a5-category-preference-picture-prompts",
          kind: "source_crop",
          imagePath: page(141),
          label: "练习 I 5 分类喜好图",
          crop: { unit: "percent", x: 3.97, y: 9.44, width: 85.84, height: 16.38, aspectRatio: 3.4695 },
          meta: { pageNo: 141, pixelX: 42, pixelY: 151, pixelWidth: 909, pixelHeight: 262 }
        }
      ]
    },
    {
      pageNo: 142,
      imagePath: page(142),
      assets: [
        {
          id: "l11-p2-a1-listening-true-false-pictures",
          kind: "source_crop",
          imagePath: page(142),
          label: "练习 II 1 听力判断图",
          crop: { unit: "percent", x: 9.73, y: 11.88, width: 87.25, height: 31.13, aspectRatio: 1.8554 },
          meta: { pageNo: 142, pixelX: 103, pixelY: 190, pixelWidth: 924, pixelHeight: 498 }
        }
      ]
    }
  ],
  assets: []
};

lesson11ImageCrops.assets = lesson11ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
