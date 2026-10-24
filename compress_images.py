#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""图片自动压缩脚本（PQC-Huanglab 站点）

用法：把原始照片/大图放进 statics/picture/ 文件夹后，在站点根目录运行：

    python compress_images.py

脚本会自动：
1. 扫描 statics/picture/ 下所有超过 100KB 的 jpg / jpeg / png / webp 原图；
2. 在 statics/picture/small/ 生成同名 .webp 压缩版（最长边超过 1600px 时等比缩小），
   网页中引用的即是这个压缩版；点击图片查看原图时加载的才是原始文件；
3. 跳过已生成且比原图新的压缩版——因此重复运行是安全的，
   新增或替换原图后再运行一次即可，只需处理有变动的文件。

注意：网页 HTML 里的引用写法为 src="./statics/picture/small/文件名.webp"，
原图完整路径写在同一标签的 data-full 属性上（用于点击查看原图）。
"""

import os
from PIL import Image

SRC_DIR = os.path.join('statics', 'picture')
OUT_DIR = os.path.join(SRC_DIR, 'small')
MAX_WIDTH = 1600          # 压缩版最大宽度（像素）
MIN_BYTES = 100 * 1024    # 小于 100KB 的原图不再压缩（本身已经很小）
PHOTO_QUALITY = 80        # JPEG 原图（照片）的压缩质量
GRAPHIC_QUALITY = 85      # PNG 原图（图表/截图，含文字）的压缩质量

VALID_EXT = ('.jpg', '.jpeg', '.png', '.webp')


def process(path):
    stem = os.path.splitext(os.path.basename(path))[0]
    out = os.path.join(OUT_DIR, stem + '.webp')
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(path):
        return  # 压缩版已是最新，跳过
    im = Image.open(path)
    if im.mode == 'P':
        im = im.convert('RGBA')
    elif im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    w, h = im.size
    if w > MAX_WIDTH:
        im = im.resize((MAX_WIDTH, round(h * MAX_WIDTH / w)), Image.LANCZOS)
    quality = GRAPHIC_QUALITY if path.lower().endswith('.png') else PHOTO_QUALITY
    im.save(out, 'WEBP', quality=quality, method=6)
    print('%s -> %s  %dx%d  %dKB' % (
        os.path.basename(path), os.path.relpath(out), im.size[0], im.size[1],
        os.path.getsize(out) // 1024))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    count = 0
    for f in sorted(os.listdir(SRC_DIR)):
        p = os.path.join(SRC_DIR, f)
        if not os.path.isfile(p):
            continue
        if f.lower().endswith(VALID_EXT) and os.path.getsize(p) > MIN_BYTES:
            process(p)
            count += 1
    if count == 0:
        print('没有需要处理的图片。')


if __name__ == '__main__':
    main()
