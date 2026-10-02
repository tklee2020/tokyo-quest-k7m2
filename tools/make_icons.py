"""홈 화면 아이콘 4종 (192·512·maskable 512·apple-touch 180) 생성 — 아빠 둘 얼굴 (노란 비니·빨간 캡).
사용: python tools/make_icons.py [출력 폴더, 기본: 저장소 루트]
필요: pip install pillow
"""
import os
import sys
from PIL import Image, ImageDraw

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
S = 2048  # 크게 그린 뒤 줄여서 계단 현상 없애기


def face(d, cx, cy, r, kind):
    skin = (245, 204, 164); eye = (29, 34, 50)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=skin)
    if kind == 'a':                       # 노란 비니 + 방울
        hat = (245, 184, 32)
        d.pieslice([cx - r, cy - r - r * 0.12, cx + r, cy + r - r * 0.12], 180, 360, fill=hat)
        d.rectangle([cx - r, cy - r * 0.12 - r * 0.02, cx + r, cy - r * 0.12 + r * 0.16], fill=hat)
        pr = r * 0.26
        d.ellipse([cx - pr, cy - r * 1.12 - pr, cx + pr, cy - r * 1.12 + pr], fill=hat)
    else:                                 # 빨간 캡 + 챙
        hat = (201, 58, 38)
        d.pieslice([cx - r, cy - r - r * 0.12, cx + r, cy + r - r * 0.12], 180, 360, fill=hat)
        d.rectangle([cx - r, cy - r * 0.12 - r * 0.02, cx + r * 1.55, cy - r * 0.12 + r * 0.2], fill=hat)
    er = r * 0.13
    for dx in (-0.36, 0.36):
        ex = cx + dx * r; ey = cy + r * 0.22
        d.ellipse([ex - er, ey - er, ex + er, ey + er], fill=eye)
    d.arc([cx - r * 0.28, cy + r * 0.22, cx + r * 0.28, cy + r * 0.62], 20, 160, fill=eye, width=int(r * 0.07))


def make(size, pad, name, bg=(29, 34, 50)):
    """pad = 가장자리 여백 비율. maskable 은 안드로이드가 원·물방울로 잘라도 얼굴이 남게 크게(0.32)."""
    im = Image.new('RGB', (S, S), bg)
    d = ImageDraw.Draw(im)
    cx, cy, sc = S / 2, S / 2, 1 - pad
    r = S * 0.19 * sc
    d.ellipse([cx - S * 0.36 * sc, cy + S * 0.2 * sc, cx + S * 0.36 * sc, cy + S * 0.3 * sc], fill=(46, 54, 80))
    face(d, cx - S * 0.13 * sc, cy + S * 0.02 * sc, r, 'a')
    face(d, cx + S * 0.15 * sc, cy + S * 0.05 * sc, r, 'b')
    im.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, name))


make(512, 0.18, 'icon-512.png')
make(192, 0.18, 'icon-192.png')
make(180, 0.08, 'apple-touch-icon.png')   # iOS 가 모서리를 알아서 둥글려요 → 꽉 채움
make(512, 0.32, 'icon-maskable-512.png')
print('icons ->', os.path.abspath(OUT))
