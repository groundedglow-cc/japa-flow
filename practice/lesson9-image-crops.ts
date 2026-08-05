import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson9/page${pageNo}.webp`;

export const lesson9ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson9",
  sourceDir: "../course-assets/by-lesson/lesson9",
  selectedImages: ["page120.webp", "page121.webp", "page122.webp"],
  pages: [
    {
      pageNo: 120,
      imagePath: page(120),
      assets: [
        {
          id: "l9-p1-a1-picture-prompts",
          kind: "source_crop",
          imagePath: page(120),
          label: "练习 I 1 听力填词图",
          crop: { unit: "percent", x: 5.29, y: 16.44, width: 91.03, height: 28.0, aspectRatio: 2.0312 },
          meta: { pageNo: 120, pixelX: 56, pixelY: 263, pixelWidth: 964, pixelHeight: 448 }
        }
      ]
    },
    {
      pageNo: 121,
      imagePath: page(121),
      assets: [
        {
          id: "l9-p1-a4-adjective-picture-prompts",
          kind: "source_crop",
          imagePath: page(121),
          label: "练习 I 4 形容词名词图",
          crop: { unit: "percent", x: 3.78, y: 8.88, width: 87.25, height: 25.81, aspectRatio: 2.1122 },
          meta: { pageNo: 121, pixelX: 40, pixelY: 142, pixelWidth: 924, pixelHeight: 413 }
        }
      ]
    },
    {
      pageNo: 122,
      imagePath: page(122),
      assets: [
        {
          id: "l9-p2-a3-listening-picture-prompts",
          kind: "source_crop",
          imagePath: page(122),
          label: "练习 II 3 听力问答图",
          crop: { unit: "percent", x: 9.73, y: 46.69, width: 85.18, height: 8.25, aspectRatio: 6.4528 },
          meta: { pageNo: 122, pixelX: 103, pixelY: 747, pixelWidth: 902, pixelHeight: 132 }
        }
      ]
    }
  ],
  assets: []
};

lesson9ImageCrops.assets = lesson9ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
