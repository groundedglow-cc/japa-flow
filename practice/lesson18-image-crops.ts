import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson18/page${pageNo}.webp`;

export const lesson18ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson18",
  sourceDir: "../course-assets/by-lesson/lesson18",
  selectedImages: ["page222.webp", "page224.webp"],
  pages: [
    {
      pageNo: 222,
      imagePath: page(222),
      assets: [
        {
          id: "l18-p1-a2-change-result-picture-table",
          kind: "source_crop",
          imagePath: page(222),
          label: "练习 I 2 变化结果图片表",
          crop: { unit: "percent", x: 8.03, y: 36.25, width: 87.16, height: 36.56, aspectRatio: 1.5778 },
          meta: { pageNo: 222, pixelX: 85, pixelY: 580, pixelWidth: 923, pixelHeight: 585 }
        }
      ]
    },
    {
      pageNo: 224,
      imagePath: page(224),
      assets: [
        {
          id: "l18-p2-a3-diary-cloze-box",
          kind: "source_crop",
          imagePath: page(224),
          label: "练习 II 3 日记填空框",
          crop: { unit: "percent", x: 8.03, y: 50.94, width: 86.87, height: 15, aspectRatio: 3.8333 },
          meta: { pageNo: 224, pixelX: 85, pixelY: 815, pixelWidth: 920, pixelHeight: 240 }
        }
      ]
    }
  ],
  assets: []
};

lesson18ImageCrops.assets = lesson18ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
