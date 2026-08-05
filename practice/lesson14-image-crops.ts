import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson14/page${pageNo}.webp`;

export const lesson14ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson14",
  sourceDir: "../course-assets/by-lesson/lesson14",
  selectedImages: ["page176.webp", "page177.webp", "page178.webp"],
  pages: [
    {
      pageNo: 176,
      imagePath: page(176),
      assets: [
        {
          id: "l14-p1-a1-te-form-pictures",
          kind: "source_crop",
          imagePath: page(176),
          label: "练习 I 1 て形图片表",
          crop: { unit: "percent", x: 9.25, y: 16.44, width: 87.63, height: 33.06, aspectRatio: 1.7543 },
          meta: { pageNo: 176, pixelX: 98, pixelY: 263, pixelWidth: 928, pixelHeight: 529 }
        }
      ]
    },
    {
      pageNo: 177,
      imagePath: page(177),
      assets: [
        {
          id: "l14-p1-a4-direction-pictures",
          kind: "source_crop",
          imagePath: page(177),
          label: "练习 I 4 方向图",
          crop: { unit: "percent", x: 3.02, y: 23.13, width: 87.35, height: 24.19, aspectRatio: 2.3902 },
          meta: { pageNo: 177, pixelX: 32, pixelY: 370, pixelWidth: 925, pixelHeight: 387 }
        }
      ]
    },
    {
      pageNo: 178,
      imagePath: page(178),
      assets: [
        {
          id: "l14-p2-a3-listening-choice-pictures",
          kind: "source_crop",
          imagePath: page(178),
          label: "练习 II 3 听力选图",
          crop: { unit: "percent", x: 9.92, y: 64.25, width: 87.54, height: 17.31, aspectRatio: 3.3466 },
          meta: { pageNo: 178, pixelX: 105, pixelY: 1028, pixelWidth: 927, pixelHeight: 277 }
        }
      ]
    }
  ],
  assets: []
};

lesson14ImageCrops.assets = lesson14ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
