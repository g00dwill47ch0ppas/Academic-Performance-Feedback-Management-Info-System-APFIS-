from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
stills = root / "output" / "stills"
files = [
    "scene-01.png",
    "scene-02-shift.png",
    "scene-03-setup.png",
    "scene-04-profile.png",
    "scene-05-scenarios.png",
    "scene-06-summary.png",
    "scene-07-privacy.png",
    "scene-08-dashboard.png",
    "scene-08-at-risk.png",
    "scene-09-student-plan.png",
    "scene-10-cohort-plan.png",
    "scene-11-impact.png",
    "scene-12-end-card.png",
]
labels = [
    "01  Cold open", "02  Analytics shift", "03  Assessment setup", "04  Academic profile",
    "05  Improvement options", "06  Summary", "07  Data separation", "08a  Lecturer dashboard",
    "08b  At-risk view", "09  Individual plan", "10  Cohort planning", "11  Impact", "12  End card",
]
tile_w, tile_h, label_h = 480, 270, 36
cols = 4
rows = (len(files) + cols - 1) // cols
canvas = Image.new("RGB", (cols * tile_w, rows * (tile_h + label_h)), "#101117")
draw = ImageDraw.Draw(canvas)
font_path = Path("C:/Windows/Fonts/segoeui.ttf")
font = ImageFont.truetype(str(font_path), 18) if font_path.exists() else ImageFont.load_default()

for i, (filename, label) in enumerate(zip(files, labels)):
    frame = Image.open(stills / filename).convert("RGB")
    frame.thumbnail((tile_w, tile_h), Image.Resampling.LANCZOS)
    x = (i % cols) * tile_w
    y = (i // cols) * (tile_h + label_h)
    canvas.paste(frame, (x, y))
    draw.rectangle((x, y + tile_h, x + tile_w, y + tile_h + label_h), fill="#191a23")
    draw.text((x + 12, y + tile_h + 8), label, font=font, fill="#edeaf4")

output = root / "output" / "stills" / "contact-sheet.png"
canvas.save(output)
print(output)
