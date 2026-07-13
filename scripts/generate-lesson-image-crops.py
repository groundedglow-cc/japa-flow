#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

import cv2


def natural_key(path):
    parts = re.split(r"(\d+)", path.name)
    return [int(part) if part.isdigit() else part for part in parts]


def page_no(path):
    match = re.search(r"page(\d+)", path.stem)
    return int(match.group(1)) if match else None


def groups(values):
    if not values:
        return []
    output = []
    start = prev = values[0]
    for value in values[1:]:
        if value == prev + 1:
            prev = value
        else:
            output.append((start, prev, (start + prev) // 2))
            start = prev = value
    output.append((start, prev, (start + prev) // 2))
    return output


def pct(value, total):
    return round(value / total * 100, 2)


def detect_table_crops(image_path, roi_y, row_threshold, col_threshold, min_row_height_pct):
    image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
    if image is None:
        return []

    height, width = image.shape
    _, threshold = cv2.threshold(image, 200, 255, cv2.THRESH_BINARY_INV)
    roi_y0 = int(height * roi_y)
    roi = threshold[roi_y0:, :]

    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (60, 1))
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 60))
    horizontal = cv2.morphologyEx(roi, cv2.MORPH_OPEN, horizontal_kernel)
    vertical = cv2.morphologyEx(roi, cv2.MORPH_OPEN, vertical_kernel)
    lines = cv2.bitwise_or(horizontal, vertical) > 0

    row_centers = [center + roi_y0 for _, _, center in groups([i for i, count in enumerate(lines.sum(axis=1)) if count > row_threshold])]
    col_centers = [center for _, _, center in groups([i for i, count in enumerate(lines.sum(axis=0)) if count > col_threshold])]

    crops = []
    if len(row_centers) < 2 or len(col_centers) < 2:
        return crops

    min_height = height * min_row_height_pct / 100
    for band_index, (top, bottom) in enumerate(zip(row_centers, row_centers[1:])):
        crop_height = bottom - top
        if crop_height < min_height:
            continue
        for col_index, (left, right) in enumerate(zip(col_centers, col_centers[1:])):
            crop_width = right - left
            crops.append({
                "rowBand": band_index,
                "column": col_index,
                "crop": {
                    "unit": "percent",
                    "x": pct(left, width),
                    "y": pct(top, height),
                    "width": pct(crop_width, width),
                    "height": pct(crop_height, height),
                    "aspectRatio": round(crop_width / crop_height, 4) if crop_height else 1
                },
                "pixels": {"x": left, "y": top, "width": crop_width, "height": crop_height}
            })
    return crops


def row_band_assets(lesson_id, number, image_ref, detected):
    by_band = {}
    for entry in detected:
        by_band.setdefault(entry["rowBand"], []).append(entry)

    assets = []
    for row_band, entries in sorted(by_band.items()):
        left = min(entry["pixels"]["x"] for entry in entries)
        top = min(entry["pixels"]["y"] for entry in entries)
        right = max(entry["pixels"]["x"] + entry["pixels"]["width"] for entry in entries)
        bottom = max(entry["pixels"]["y"] + entry["pixels"]["height"] for entry in entries)
        width = right - left
        height = bottom - top
        assets.append({
            "id": f"{lesson_id}-page{number}-rb{row_band}",
            "kind": "table",
            "imagePath": image_ref,
            "label": f"page{number} rowBand {row_band}",
            "crop": {"unit": "percent", "x": 0, "y": 0, "width": 0, "height": 0, "aspectRatio": 1},
            "meta": {
                "pageNo": number,
                "rowBand": row_band,
                "columns": len(entries),
                "pixelX": left,
                "pixelY": top,
                "pixelWidth": width,
                "pixelHeight": height,
            },
        })
    return assets


def normalize_row_asset_crops(assets, image_path):
    image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
    if image is None:
        return assets
    image_height, image_width = image.shape
    for asset in assets:
        meta = asset["meta"]
        asset["crop"] = {
            "unit": "percent",
            "x": pct(meta["pixelX"], image_width),
            "y": pct(meta["pixelY"], image_height),
            "width": pct(meta["pixelWidth"], image_width),
            "height": pct(meta["pixelHeight"], image_height),
            "aspectRatio": round(meta["pixelWidth"] / meta["pixelHeight"], 4) if meta["pixelHeight"] else 1,
        }
    return assets


def catalog_for_lesson(args):
    lesson_dir = Path(args.lesson_dir)
    files = sorted(lesson_dir.glob("*.webp"), key=natural_key)
    selected = files[-4:-1] if len(files) >= 4 else files
    lesson_id = args.lesson_id or lesson_dir.name
    asset_prefix = args.asset_prefix or f"../course-assets/by-lesson/{lesson_dir.name}"

    pages = []
    all_assets = []
    for image_path in selected:
        number = page_no(image_path)
        if number is None:
            continue
        image_ref = f"{asset_prefix}/{image_path.name}"
        detected = detect_table_crops(
            image_path,
            roi_y=args.roi_y,
            row_threshold=args.row_threshold,
            col_threshold=args.col_threshold,
            min_row_height_pct=args.min_row_height_pct,
        )
        assets = normalize_row_asset_crops(row_band_assets(lesson_id, number, image_ref, detected), image_path)
        if args.include_cells:
            for entry in detected:
                asset = {
                    "id": f"{lesson_id}-page{number}-rb{entry['rowBand']}-c{entry['column']}",
                    "kind": "source_crop",
                    "imagePath": image_ref,
                    "label": f"page{number} rowBand {entry['rowBand']} col {entry['column']}",
                    "crop": entry["crop"],
                    "meta": {
                        "pageNo": number,
                        "rowBand": entry["rowBand"],
                        "column": entry["column"],
                        "pixelX": entry["pixels"]["x"],
                        "pixelY": entry["pixels"]["y"],
                        "pixelWidth": entry["pixels"]["width"],
                        "pixelHeight": entry["pixels"]["height"],
                    },
                }
                assets.append(asset)
        pages.append({"pageNo": number, "imagePath": image_ref, "assets": assets})
        all_assets.extend(assets)

    return {
        "lessonId": lesson_id,
        "sourceDir": asset_prefix,
        "selectedImages": [path.name for path in selected],
        "pages": pages,
        "assets": all_assets,
    }


def ts_module(catalog, export_name):
    return (
        'import type { LessonImageCropCatalog } from "./lesson-practice-types";\n\n'
        f"export const {export_name}: LessonImageCropCatalog = "
        + json.dumps(catalog, ensure_ascii=False, indent=2)
        + ";\n"
    )


def main():
    parser = argparse.ArgumentParser(description="Generate lesson image crop catalog from the last practice pages in a lesson directory.")
    parser.add_argument("lesson_dir")
    parser.add_argument("--lesson-id", default="")
    parser.add_argument("--asset-prefix", default="")
    parser.add_argument("--format", choices=["json", "ts"], default="json")
    parser.add_argument("--export-name", default="lessonImageCrops")
    parser.add_argument("--out", default="")
    parser.add_argument("--include-cells", action="store_true")
    parser.add_argument("--roi-y", type=float, default=0.55)
    parser.add_argument("--row-threshold", type=int, default=500)
    parser.add_argument("--col-threshold", type=int, default=250)
    parser.add_argument("--min-row-height-pct", type=float, default=5.0)
    args = parser.parse_args()

    catalog = catalog_for_lesson(args)
    output = ts_module(catalog, args.export_name) if args.format == "ts" else json.dumps(catalog, ensure_ascii=False, indent=2) + "\n"
    if args.out:
        Path(args.out).write_text(output)
    else:
        print(output, end="")


if __name__ == "__main__":
    main()
