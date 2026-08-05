import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson16/page${pageNo}.webp`;

export const lesson16ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson16",
  sourceDir: "../course-assets/by-lesson/lesson16",
  selectedImages: ["page197.webp", "page198.webp"],
  pages: [
    {
      pageNo: 197,
      imagePath: page(197),
      assets: [
        {
          id: "l16-p1-a6-wallet-bag-picture-prompts",
          kind: "source_crop",
          imagePath: page(197),
          label: "练习 I 6 钱包和包提示图",
          crop: { unit: "percent", x: 3.31, y: 29.38, width: 89.71, height: 28.13, aspectRatio: 2.1111 },
          meta: { pageNo: 197, pixelX: 35, pixelY: 470, pixelWidth: 950, pixelHeight: 450 }
        }
      ]
    },
    {
      pageNo: 198,
      imagePath: page(198),
      assets: [
        {
          id: "l16-p2-a4-necktie-shop-picture",
          kind: "source_crop",
          imagePath: page(198),
          label: "练习 II 4 领带店图",
          crop: { unit: "percent", x: 67.99, y: 65, width: 30.22, height: 17.5, aspectRatio: 1.1429 },
          meta: { pageNo: 198, pixelX: 720, pixelY: 1040, pixelWidth: 320, pixelHeight: 280 }
        }
      ]
    }
  ],
  assets: []
};

lesson16ImageCrops.assets = lesson16ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
