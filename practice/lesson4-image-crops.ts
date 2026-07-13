import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson4/page${pageNo}.webp`;

export const lesson4ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson4",
  sourceDir: "../course-assets/by-lesson/lesson4",
  selectedImages: ["page58.webp", "page59.webp", "page60.webp"],
  pages: [
    {
      pageNo: 58,
      imagePath: page(58),
      assets: [
        {
          id: "l4-p1-a3-object-picture-practice",
          kind: "table",
          imagePath: page(58),
          label: "练习 I · 3 物品位置图",
          crop: { unit: "percent", x: 9.07, y: 42.81, width: 88.01, height: 16.88, aspectRatio: 3.4519 },
          meta: { pageNo: 58, pixelX: 96, pixelY: 685, pixelWidth: 932, pixelHeight: 270 }
        },
        {
          id: "l4-p1-a3-person-picture-practice",
          kind: "table",
          imagePath: page(58),
          label: "练习 I · 3 人物位置图",
          crop: { unit: "percent", x: 9.44, y: 68, width: 87.72, height: 15.38, aspectRatio: 3.7764 },
          meta: { pageNo: 58, pixelX: 100, pixelY: 1088, pixelWidth: 929, pixelHeight: 246 }
        }
      ]
    },
    {
      pageNo: 59,
      imagePath: page(59),
      assets: [
        {
          id: "l4-p1-a5-room-picture-practice",
          kind: "scene",
          imagePath: page(59),
          label: "练习 I · 5 房间位置图",
          crop: { unit: "percent", x: 3.59, y: 31.25, width: 87.35, height: 15.63, aspectRatio: 3.7 },
          meta: { pageNo: 59, pixelX: 38, pixelY: 500, pixelWidth: 925, pixelHeight: 250 }
        },
        {
          id: "l4-p1-a6-picture-practice",
          kind: "table",
          imagePath: page(59),
          label: "练习 I · 6 位置问答图",
          crop: { unit: "percent", x: 3.78, y: 52.19, width: 87.16, height: 37.5, aspectRatio: 1.5383 },
          meta: { pageNo: 59, pixelX: 40, pixelY: 835, pixelWidth: 923, pixelHeight: 600 }
        }
      ]
    },
    {
      pageNo: 60,
      imagePath: page(60),
      assets: [
        {
          id: "l4-p2-a1-scene-picture-practice",
          kind: "scene",
          imagePath: page(60),
          label: "练习 II · 1 街景判断图",
          crop: { unit: "percent", x: 9.25, y: 7.25, width: 84.51, height: 13.13, aspectRatio: 4.2619 },
          meta: { pageNo: 60, pixelX: 98, pixelY: 116, pixelWidth: 895, pixelHeight: 210 }
        },
        {
          id: "l4-p2-a3-map-picture-practice",
          kind: "map",
          imagePath: page(60),
          label: "练习 II · 3 车站与百货商店图",
          crop: { unit: "percent", x: 9.25, y: 55.31, width: 81.68, height: 21.88, aspectRatio: 2.4714 },
          meta: { pageNo: 60, pixelX: 98, pixelY: 885, pixelWidth: 865, pixelHeight: 350 }
        }
      ]
    }
  ],
  assets: []
};

lesson4ImageCrops.assets = lesson4ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
