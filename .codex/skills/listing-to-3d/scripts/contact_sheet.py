#!/usr/bin/env python3
"""Create labeled source inventories or reference/render comparisons. Requires Pillow."""
import argparse
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps


def load_image(path, crop=None, size=None):
    path = Path(path).resolve()
    with Image.open(path) as original:
        original.load()
        image = ImageOps.exif_transpose(original).convert('RGB')
    if crop is not None:
        if not isinstance(crop, list) or len(crop) != 4:
            raise ValueError(f'{path.name}: crop must contain four normalized coordinates')
        left, top, right, bottom = map(float, crop)
        if not (0 <= left < right <= 1 and 0 <= top < bottom <= 1):
            raise ValueError(f'{path.name}: crop must satisfy 0 <= left < right <= 1 and 0 <= top < bottom <= 1')
        image = image.crop((round(left * image.width), round(top * image.height),
                            round(right * image.width), round(bottom * image.height)))
        if image.width == 0 or image.height == 0:
            raise ValueError(f'{path.name}: crop is empty at this resolution')
    if size is not None:
        image.thumbnail(size, Image.Resampling.LANCZOS)
    return image


def panel(sheet, image, x, y, width, height, label):
    draw = ImageDraw.Draw(sheet)
    # Default Pillow font is portable; sanitize labels for older font builds.
    label = str(label).encode('ascii', 'replace').decode('ascii')
    while label and draw.textbbox((0, 0), label)[2] > width - 20:
        label = label[:-4] + '...'
    draw.text((x + 10, y + 8), label, fill='#242820')
    fitted = ImageOps.contain(image, (width - 20, height - 40), Image.Resampling.LANCZOS)
    sheet.paste(fitted, (x + (width - fitted.width) // 2, y + 30 + (height - 40 - fitted.height) // 2))


def write_pages(rows, output, cols, width, height, rows_per_page, source_paths):
    output = Path(output).resolve()
    if output.suffix.lower() not in ('.jpg', '.jpeg', '.png'):
        raise ValueError('Output must use .jpg, .jpeg, or .png')
    page_count = math.ceil(len(rows) / rows_per_page)
    paths = [output if i == 0 else output.with_name(f'{output.stem}-{i+1:02}{output.suffix}')
             for i in range(page_count)]
    if any(path in source_paths for path in paths):
        raise ValueError('Output would overwrite a source image')
    output.parent.mkdir(parents=True, exist_ok=True)
    for index, path in enumerate(paths):
        page_rows = rows[index * rows_per_page:(index + 1) * rows_per_page]
        sheet = Image.new('RGB', (cols * width, len(page_rows) * height), '#eeeae2')
        for row_index, row in enumerate(page_rows):
            for col_index, (image, label) in enumerate(row):
                panel(sheet, image, col_index * width, row_index * height, width, height, label)
        sheet.save(path, **({'quality': 93} if path.suffix.lower() in ('.jpg', '.jpeg') else {}))
        print(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_subparsers(dest='mode', required=True)
    inventory = modes.add_parser('inventory', help='Create source thumbnails in supplied order')
    inventory.add_argument('images', nargs='+', type=Path)
    inventory.add_argument('--columns', type=int, default=4)
    compare = modes.add_parser('compare', help='Pair reference/render paths from JSON; no stretching')
    compare.add_argument('--pairs', type=Path, required=True)
    for mode in (inventory, compare):
        mode.add_argument('--output', type=Path, required=True)
        mode.add_argument('--width', type=int, default=420, help='Width of one panel')
        mode.add_argument('--height', type=int, default=320, help='Height of one panel')
        mode.add_argument('--rows-per-page', type=int, default=5,
                          help='Additional pages use suffixes -02, -03, etc.')
    args = parser.parse_args()
    try:
        if args.width < 80 or args.height < 80 or args.rows_per_page < 1:
            raise ValueError('Panel dimensions must be >=80 pixels and rows-per-page must be positive')
        sources = set()
        if args.mode == 'inventory':
            if args.columns < 1:
                raise ValueError('columns must be positive')
            cols = args.columns
            panels = []
            for path in args.images:
                sources.add(path.resolve())
                panels.append((load_image(path, size=(args.width-20, args.height-40)), path.name))
            rows = [panels[i:i+cols] for i in range(0, len(panels), cols)]
        else:
            cols = 2
            pairs_path = args.pairs.resolve()
            pairs = json.loads(pairs_path.read_text())
            if not isinstance(pairs, list) or not pairs:
                raise ValueError('Comparison JSON must be a nonempty array')
            rows = []
            for i, pair in enumerate(pairs):
                if not isinstance(pair, dict):
                    raise ValueError(f'Pair {i+1} must be an object')
                row = []
                for kind in ('reference', 'render'):
                    path = (pairs_path.parent / pair[kind]).resolve()
                    sources.add(path)
                    row.append((load_image(path, pair.get(kind + '_crop'), (args.width-20, args.height-40)),
                                f'{pair.get("id", i+1)} | {kind.upper()}'))
                rows.append(row)
        write_pages(rows, args.output, cols, args.width, args.height, args.rows_per_page, sources)
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.error(str(error))


if __name__ == '__main__':
    main()
