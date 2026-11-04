"""Genera el arte social original 1200×630 con las fuentes de la web.
Requiere: python -m pip install pillow fonttools brotli
"""
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
def font(size, weight=800):
    path=ROOT / f'node_modules/@fontsource/montserrat/files/montserrat-latin-{weight}-normal.woff2'
    f=TTFont(path); f.flavor=None; stream=BytesIO(); f.save(stream); stream.seek(0)
    return ImageFont.truetype(stream,size)

img=Image.new('RGB',(1200,630),'#0b0b0b'); d=ImageDraw.Draw(img)
for y in range(630):
    for x in range(1200):
        light=max(0,1-(((x-940)/620)**2+((y-230)/480)**2))
        img.putpixel((x,y),(int(11+13*light),int(11+11*light),int(11+5*light)))
d=ImageDraw.Draw(img)
gold='#C9A227'; paper='#F5F3EE'; muted='#b3b0a9'
d.text((68,45),'TRUJILLO',font=font(29),fill=paper)
d.text((68,90),'DINERO · INVERSIONES · NEGOCIOS',font=font(9,400),fill=muted)
d.line((68,121,1132,121),fill='#34332d')
d.text((68,164),'TU PLATA. TUS DECISIONES.',font=font(12,600),fill=muted)
d.text((63,202),'Las cuentas',font=font(65),fill=paper)
d.text((63,277),'claras.',font=font(75),fill=gold)
d.text((68,385),'4 calculadoras gratis para Colombia.',font=font(17,400),fill=paper)
d.rounded_rectangle((68,439,340,486),radius=24,fill=gold)
d.text((91,454),'El dinero se aprende.',font=font(13,600),fill='#0b0b0b')
cards=[(685,166,900,326,'01','18,2 h','TU TIEMPO'),(918,166,1133,326,'02','25 %','TU AHORRO'),(685,344,900,504,'03','CDT','TUS POSIBILIDADES'),(918,344,1133,504,'04','4×1000','TUS MOVIMIENTOS')]
for x1,y1,x2,y2,num,value,label in cards:
    d.rounded_rectangle((x1+2,y1+8,x2+2,y2+8),radius=17,fill='#070707')
    d.rounded_rectangle((x1,y1,x2,y2),radius=17,fill='#1d1d1a',outline='#49422a',width=1)
    d.text((x1+18,y1+15),num,font=font(10,400),fill=muted)
    d.text((x1+18,y1+49),value,font=font(32 if len(value)>5 else 40),fill=gold)
    d.text((x1+18,y2-30),label,font=font(8,600),fill=muted)
d.line((68,548,1132,548),fill='#34332d')
d.text((68,572),'CALCULADORAS TRUJILLO',font=font(10,600),fill=muted)
d.text((852,572),'GRATIS · HECHAS PARA COLOMBIA',font=font(9,400),fill=muted)
img.save(ROOT/'public/og.png',optimize=True)
print('public/og.png · 1200×630')
