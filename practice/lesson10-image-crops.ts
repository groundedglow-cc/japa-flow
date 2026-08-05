import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson10/page${pageNo}.webp`;

export const lesson10ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson10",
  sourceDir: "../course-assets/by-lesson/lesson10",
  selectedImages: ["page130.webp"],
  pages: [
    {
      pageNo: 130,
      imagePath: page(130),
      assets: [
        {
          id: "l10-p1-a1-na-adjective-picture-prompts",
          kind: "source_crop",
          imagePath: page(130),
          label: "练习 I 1 ナ形容词图",
          crop: { unit: "percent", x: 8.88, y: 16.56, width: 87.25, height: 30.44, aspectRatio: 1.8973 },
          meta: { pageNo: 130, pixelX: 94, pixelY: 265, pixelWidth: 924, pixelHeight: 487 }
        }
      ]
    }
  ],
  assets: []
};

lesson10ImageCrops.assets = lesson10ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
