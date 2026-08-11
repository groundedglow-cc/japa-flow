import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson23/page${pageNo}.webp`;

export const lesson23ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson23",
  sourceDir: "../course-assets/by-lesson/lesson23",
  selectedImages: ["page278.webp", "page279.webp", "page280.webp"],
  pages: [
    {
      pageNo: 278,
      imagePath: page(278),
      assets: [
        {
          id: "l23-p1-a1-picture-substitution",
          kind: "source_crop",
          imagePath: page(278),
          label: "练习 I 1 看图替换",
          crop: { unit: "percent", x: 6.0, y: 12.0, width: 88.4, height: 42.6, aspectRatio: 1.373 },
          meta: { pageNo: 278 }
        },
        {
          id: "l23-p1-a2-tari-substitution",
          kind: "source_crop",
          imagePath: page(278),
          label: "练习 I 2 たり替换",
          crop: { unit: "percent", x: 6.0, y: 55.0, width: 88.4, height: 17.7, aspectRatio: 3.306 },
          meta: { pageNo: 278 }
        },
        {
          id: "l23-p1-a3-answer-question",
          kind: "source_crop",
          imagePath: page(278),
          label: "练习 I 3 回答提问",
          crop: { unit: "percent", x: 6.0, y: 74.0, width: 88.4, height: 16.8, aspectRatio: 3.483 },
          meta: { pageNo: 278 }
        }
      ]
    },
    {
      pageNo: 279,
      imagePath: page(279),
      assets: [
        {
          id: "l23-p1-a4-listening-transform",
          kind: "source_crop",
          imagePath: page(279),
          label: "练习 I 4 听录音替换",
          crop: { unit: "percent", x: 6.0, y: 4.8, width: 88.4, height: 31.5, aspectRatio: 1.857 },
          meta: { pageNo: 279 }
        },
        {
          id: "l23-p1-a5-transform",
          kind: "source_crop",
          imagePath: page(279),
          label: "练习 I 5 かどうか转换",
          crop: { unit: "percent", x: 6.0, y: 37.4, width: 88.4, height: 24.8, aspectRatio: 2.359 },
          meta: { pageNo: 279 }
        },
        {
          id: "l23-p1-a6-listening-picture",
          kind: "source_crop",
          imagePath: page(279),
          label: "练习 I 6 边看图边听录音",
          crop: { unit: "percent", x: 6.0, y: 66.0, width: 88.4, height: 25.0, aspectRatio: 2.340 },
          meta: { pageNo: 279 }
        }
      ]
    },
    {
      pageNo: 280,
      imagePath: page(280),
      assets: [
        {
          id: "l23-p2-a1-connect",
          kind: "source_crop",
          imagePath: page(280),
          label: "练习 II 1 连接正确答案",
          crop: { unit: "percent", x: 6.0, y: 8.0, width: 88.4, height: 18.7, aspectRatio: 3.129 },
          meta: { pageNo: 280 }
        },
        {
          id: "l23-p2-a2-listening-table",
          kind: "source_crop",
          imagePath: page(280),
          label: "练习 II 2 听录音画○",
          crop: { unit: "percent", x: 6.0, y: 28.0, width: 88.4, height: 23.9, aspectRatio: 2.448 },
          meta: { pageNo: 280 }
        },
        {
          id: "l23-p2-a3-fill",
          kind: "source_crop",
          imagePath: page(280),
          label: "练习 II 3 填入适当词语",
          crop: { unit: "percent", x: 6.0, y: 53.0, width: 88.4, height: 14.2, aspectRatio: 4.120 },
          meta: { pageNo: 280 }
        },
        {
          id: "l23-p2-a4-word-bank",
          kind: "source_crop",
          imagePath: page(280),
          label: "练习 II 4 词框选择",
          crop: { unit: "percent", x: 6.0, y: 70.0, width: 88.4, height: 13.0, aspectRatio: 4.501 },
          meta: { pageNo: 280 }
        },
        {
          id: "l23-p2-a5-translation",
          kind: "source_crop",
          imagePath: page(280),
          label: "练习 II 5 翻译",
          crop: { unit: "percent", x: 6.0, y: 85.0, width: 88.4, height: 9.4, aspectRatio: 6.224 },
          meta: { pageNo: 280 }
        }
      ]
    }
  ],
  assets: []
};

lesson23ImageCrops.assets = lesson23ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
