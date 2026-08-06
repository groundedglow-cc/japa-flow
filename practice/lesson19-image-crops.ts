import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson19/page${pageNo}.webp`;

export const lesson19ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson19",
  sourceDir: "../course-assets/by-lesson/lesson19",
  selectedImages: ["page232.webp", "page233.webp", "page234.webp", "page235.webp"],
  pages: [
    {
      pageNo: 232,
      imagePath: page(232),
      assets: [
        {
          id: "l19-page232-full",
          kind: "source_crop",
          imagePath: page(232),
          label: "第19课 练习I 页面232",
          crop: { unit: "percent", x: 0, y: 0, width: 100, height: 100, aspectRatio: 0.6619 },
          meta: { pageNo: 232, pixelX: 0, pixelY: 0, pixelWidth: 1059, pixelHeight: 1600 }
        }
      ]
    },
    {
      pageNo: 233,
      imagePath: page(233),
      assets: [
        {
          id: "l19-page233-full",
          kind: "source_crop",
          imagePath: page(233),
          label: "第19课 练习I 页面233",
          crop: { unit: "percent", x: 0, y: 0, width: 100, height: 100, aspectRatio: 0.6619 },
          meta: { pageNo: 233, pixelX: 0, pixelY: 0, pixelWidth: 1059, pixelHeight: 1600 }
        }
      ]
    },
    {
      pageNo: 234,
      imagePath: page(234),
      assets: [
        {
          id: "l19-page234-full",
          kind: "source_crop",
          imagePath: page(234),
          label: "第19课 练习II 页面234",
          crop: { unit: "percent", x: 0, y: 0, width: 100, height: 100, aspectRatio: 0.6619 },
          meta: { pageNo: 234, pixelX: 0, pixelY: 0, pixelWidth: 1059, pixelHeight: 1600 }
        }
      ]
    },
    {
      pageNo: 235,
      imagePath: page(235),
      assets: [
        {
          id: "l19-page235-full",
          kind: "source_crop",
          imagePath: page(235),
          label: "第19课 生词表 页面235",
          crop: { unit: "percent", x: 0, y: 0, width: 100, height: 100, aspectRatio: 0.6619 },
          meta: { pageNo: 235, pixelX: 0, pixelY: 0, pixelWidth: 1059, pixelHeight: 1600 }
        }
      ]
    }
  ],
  assets: []
};

lesson19ImageCrops.assets = lesson19ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
