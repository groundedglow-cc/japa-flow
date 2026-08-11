import type { LessonImageCropCatalog } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson20/page${pageNo}.webp`;

export const lesson20ImageCrops: LessonImageCropCatalog = {
  lessonId: "lesson20",
  sourceDir: "../course-assets/by-lesson/lesson20",
  selectedImages: ["page242.webp", "page243.webp", "page244.webp"],
  pages: [
    {
      pageNo: 242,
      imagePath: page(242),
      assets: [
        {
          id: "l20-p1-a1-picture-grid",
          kind: "source_crop",
          imagePath: page(242),
          label: "练习 I 1 能力图片表",
          crop: { unit: "percent", x: 7.84, y: 15.25, width: 87.82, height: 30.88, aspectRatio: 1.8818 },
          meta: { pageNo: 242, pixelX: 83, pixelY: 244, pixelWidth: 930, pixelHeight: 494 }
        },
        {
          id: "l20-p1-a2-dialogue",
          kind: "source_crop",
          imagePath: page(242),
          label: "练习 I 2 能力会话",
          crop: { unit: "percent", x: 7.84, y: 50.0, width: 87.82, height: 15.5, aspectRatio: 3.748 },
          meta: { pageNo: 242, pixelX: 83, pixelY: 800, pixelWidth: 930, pixelHeight: 248 }
        },
        {
          id: "l20-p1-a3-dialogue",
          kind: "source_crop",
          imagePath: page(242),
          label: "练习 I 3 许可与兴趣",
          crop: { unit: "percent", x: 7.84, y: 68.0, width: 87.82, height: 22.0, aspectRatio: 2.6477 },
          meta: { pageNo: 242, pixelX: 83, pixelY: 1088, pixelWidth: 930, pixelHeight: 352 }
        }
      ]
    },
    {
      pageNo: 243,
      imagePath: page(243),
      assets: [
        {
          id: "l20-p1-a4-basic-form-table",
          kind: "source_crop",
          imagePath: page(243),
          label: "练习 I 4 ます形/基本形表",
          crop: { unit: "percent", x: 5.67, y: 8.5, width: 82.15, height: 37.0, aspectRatio: 1.4697 },
          meta: { pageNo: 243, pixelX: 60, pixelY: 136, pixelWidth: 870, pixelHeight: 592 }
        },
        {
          id: "l20-p1-a5-dialogue",
          kind: "source_crop",
          imagePath: page(243),
          label: "练习 I 5 兴趣会话",
          crop: { unit: "percent", x: 5.67, y: 48.0, width: 86.4, height: 22.75, aspectRatio: 2.5144 },
          meta: { pageNo: 243, pixelX: 60, pixelY: 768, pixelWidth: 915, pixelHeight: 364 }
        },
        {
          id: "l20-p1-a6-dialogue",
          kind: "source_crop",
          imagePath: page(243),
          label: "练习 I 6 前に会话",
          crop: { unit: "percent", x: 5.67, y: 74.0, width: 86.4, height: 15.0, aspectRatio: 3.6 },
          meta: { pageNo: 243, pixelX: 60, pixelY: 1184, pixelWidth: 915, pixelHeight: 240 }
        }
      ]
    },
    {
      pageNo: 244,
      imagePath: page(244),
      assets: [
        {
          id: "l20-p2-a1-form-change",
          kind: "source_crop",
          imagePath: page(244),
          label: "练习 II 1 形式变换",
          crop: { unit: "percent", x: 7.84, y: 8.5, width: 88.0, height: 22.75, aspectRatio: 2.5618 },
          meta: { pageNo: 244, pixelX: 83, pixelY: 136, pixelWidth: 932, pixelHeight: 364 }
        },
        {
          id: "l20-p2-a2-before-picture-grid",
          kind: "source_crop",
          imagePath: page(244),
          label: "练习 II 2 前に看图造句",
          crop: { unit: "percent", x: 7.84, y: 34.0, width: 88.0, height: 32.5, aspectRatio: 1.7923 },
          meta: { pageNo: 244, pixelX: 83, pixelY: 544, pixelWidth: 932, pixelHeight: 520 }
        },
        {
          id: "l20-p2-a3-listening",
          kind: "source_crop",
          imagePath: page(244),
          label: "练习 II 3 听录音回答",
          crop: { unit: "percent", x: 7.84, y: 69.5, width: 88.0, height: 14.0, aspectRatio: 4.1607 },
          meta: { pageNo: 244, pixelX: 83, pixelY: 1112, pixelWidth: 932, pixelHeight: 224 }
        },
        {
          id: "l20-p2-a4-translation",
          kind: "source_crop",
          imagePath: page(244),
          label: "练习 II 4 翻译",
          crop: { unit: "percent", x: 7.84, y: 86.5, width: 88.0, height: 9.5, aspectRatio: 6.1316 },
          meta: { pageNo: 244, pixelX: 83, pixelY: 1384, pixelWidth: 932, pixelHeight: 152 }
        }
      ]
    }
  ],
  assets: []
};

lesson20ImageCrops.assets = lesson20ImageCrops.pages.flatMap((sourcePage) => sourcePage.assets);
