#!/usr/bin/env python3
import argparse
import json

import cv2
import numpy as np


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


def main():
    parser = argparse.ArgumentParser(description="Detect table-like crop boxes from a textbook page.")
    parser.add_argument("image")
    parser.add_argument("--roi-y", type=float, default=0.65, help="Top of search ROI as image-height ratio.")
    parser.add_argument("--row-threshold", type=int, default=500)
    parser.add_argument("--col-threshold", type=int, default=250)
    args = parser.parse_args()

    image = cv2.imread(args.image, cv2.IMREAD_GRAYSCALE)
    if image is None:
        raise SystemExit(f"Cannot read image: {args.image}")

    height, width = image.shape
    _, threshold = cv2.threshold(image, 200, 255, cv2.THRESH_BINARY_INV)
    roi_y0 = int(height * args.roi_y)
    roi = threshold[roi_y0:, :]

    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (60, 1))
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 60))
    horizontal = cv2.morphologyEx(roi, cv2.MORPH_OPEN, horizontal_kernel)
    vertical = cv2.morphologyEx(roi, cv2.MORPH_OPEN, vertical_kernel)
    lines = cv2.bitwise_or(horizontal, vertical) > 0

    row_centers = [center + roi_y0 for _, _, center in groups([i for i, count in enumerate(lines.sum(axis=1)) if count > args.row_threshold])]
    col_centers = [center for _, _, center in groups([i for i, count in enumerate(lines.sum(axis=0)) if count > args.col_threshold])]

    crops = []
    row_bands = []
    if len(row_centers) >= 2 and len(col_centers) >= 2:
        for band_index, (top, bottom) in enumerate(zip(row_centers, row_centers[1:])):
            crop_height = bottom - top
            row_bands.append({"index": band_index, "top": top, "bottom": bottom, "height": crop_height})
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

    print(json.dumps({
        "image": args.image,
        "sourceSize": {"width": width, "height": height},
        "rowCenters": row_centers,
        "colCenters": col_centers,
        "rowBands": row_bands,
        "crops": crops
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
