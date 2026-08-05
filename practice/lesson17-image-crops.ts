import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson17/page${pageNo}.webp`;

export const lesson17ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson17",
  sourceDir: "../course-assets/by-lesson/lesson17",
  selectedImages: ["page212.webp"],
  pages: [
    {
      pageNo: 212,
      imagePath: page(212),
      assets: [
        {
          id: "l17-p1-a2-desire-word-bubbles",
          kind: "source_crop",
          imagePath: page(212),
          label: "练习 I 2 替换词气泡",
          crop: { unit: "percent", x: 6.14, y: 29.69, width: 89.23, height: 12.81, aspectRatio: 4.6098 },
          meta: { pageNo: 212, pixelX: 65, pixelY: 475, pixelWidth: 945, pixelHeight: 205 }
        },
        {
          id: "l17-p1-a3-tai-form-table",
          kind: "source_crop",
          imagePath: page(212),
          label: "练习 I 3 たい形变形表",
          crop: { unit: "percent", x: 8.31, y: 45.94, width: 83.57, height: 32.69, aspectRatio: 1.6922 },
          meta: { pageNo: 212, pixelX: 88, pixelY: 735, pixelWidth: 885, pixelHeight: 523 }
        }
      ]
    }
  ],
  assets: []
};

lesson17ImageCrops.assets = lesson17ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
