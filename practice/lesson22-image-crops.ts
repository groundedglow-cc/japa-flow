import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson22/page${pageNo}.webp`;

export const lesson22ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson22",
  sourceDir: "../course-assets/by-lesson/lesson22",
  selectedImages: ["page268.webp", "page269.webp", "page270.webp"],
  pages: [
    {
      pageNo: 268,
      imagePath: page(268),
      assets: [
        {
          id: "l22-p1-a1-conjugation",
          kind: "source_crop",
          imagePath: page(268),
          label: "练习 I 1 形容词/动词变形",
          crop: { unit: "percent", x: 6.3, y: 12.4, width: 88.4, height: 40.8, aspectRatio: 1.435 },
          meta: { pageNo: 268 }
        },
        {
          id: "l22-p1-a2-plain-form",
          kind: "source_crop",
          imagePath: page(268),
          label: "练习 I 2 普通形替换",
          crop: { unit: "percent", x: 6.3, y: 54.5, width: 88.4, height: 36.4, aspectRatio: 1.519 },
          meta: { pageNo: 268 }
        }
      ]
    },
    {
      pageNo: 269,
      imagePath: page(269),
      assets: [
        {
          id: "l22-p1-a3-dialogue",
          kind: "source_crop",
          imagePath: page(269),
          label: "练习 I 3 けど会话",
          crop: { unit: "percent", x: 6.1, y: 7.0, width: 87.8, height: 18.5, aspectRatio: 2.967 },
          meta: { pageNo: 269 }
        },
        {
          id: "l22-p1-a4-table",
          kind: "source_crop",
          imagePath: page(269),
          label: "练习 I 4 活用表",
          crop: { unit: "percent", x: 6.1, y: 27.0, width: 87.8, height: 41.0, aspectRatio: 1.338 },
          meta: { pageNo: 269 }
        },
        {
          id: "l22-p1-a5-dialogue",
          kind: "source_crop",
          imagePath: page(269),
          label: "练习 I 5 诱约会话",
          crop: { unit: "percent", x: 6.1, y: 70.0, width: 87.8, height: 17.6, aspectRatio: 3.117 },
          meta: { pageNo: 269 }
        }
      ]
    },
    {
      pageNo: 270,
      imagePath: page(270),
      assets: [
        {
          id: "l22-p2-a1-cloze",
          kind: "source_crop",
          imagePath: page(270),
          label: "练习 II 1 对话填空",
          crop: { unit: "percent", x: 6.2, y: 8.5, width: 88.2, height: 25.0, aspectRatio: 2.205 },
          meta: { pageNo: 270 }
        },
        {
          id: "l22-p2-a2-word-bank",
          kind: "source_crop",
          imagePath: page(270),
          label: "练习 II 2 副词填空",
          crop: { unit: "percent", x: 6.2, y: 35.2, width: 88.2, height: 19.2, aspectRatio: 2.871 },
          meta: { pageNo: 270 }
        },
        {
          id: "l22-p2-a3-reading",
          kind: "source_crop",
          imagePath: page(270),
          label: "练习 II 3 日记阅读",
          crop: { unit: "percent", x: 6.2, y: 55.8, width: 88.2, height: 28.4, aspectRatio: 1.941 },
          meta: { pageNo: 270 }
        },
        {
          id: "l22-p2-a4-translation",
          kind: "source_crop",
          imagePath: page(270),
          label: "练习 II 4 翻译",
          crop: { unit: "percent", x: 6.2, y: 84.4, width: 80.0, height: 9.8, aspectRatio: 5.102 },
          meta: { pageNo: 270 }
        }
      ]
    }
  ],
  assets: []
};

lesson22ImageCrops.assets = lesson22ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
