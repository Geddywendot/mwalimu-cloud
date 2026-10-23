import os
from PIL import Image, ImageDraw, ImageFont

FONT_BOLD = "/usr/share/fonts/julietaula-montserrat-fonts/Montserrat-Bold.otf"
FONT_REG = "/usr/share/fonts/julietaula-montserrat-fonts/Montserrat-Regular.otf"

def add_chapter_overlay(image_path, chapter_num, chapter_title, timestamp_str, output_path):
    im = Image.open(image_path).convert("RGBA")
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Top floating banner pill in top right
    # Box dimensions
    pill_w = 680
    pill_h = 60
    pill_x = im.width - pill_w - 30
    pill_y = 20

    # Draw rounded rectangle with dark ink background #0E3B43 and tide border #1B7F8C
    draw.rounded_rectangle(
        [(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)],
        radius=14,
        fill=(14, 59, 67, 240),
        outline=(27, 127, 140, 255),
        width=2
    )

    # Gold dot
    dot_r = 6
    dot_cx = pill_x + 25
    dot_cy = pill_y + pill_h // 2
    draw.ellipse(
        [(dot_cx - dot_r, dot_cy - dot_r), (dot_cx + dot_r, dot_cy + dot_r)],
        fill=(244, 180, 26, 255)
    )

    # Font
    font_title = ImageFont.truetype(FONT_BOLD, 18)
    font_sub = ImageFont.truetype(FONT_REG, 14)

    # Chapter text
    draw.text(
        (pill_x + 45, pill_y + 12),
        f"SCENE {chapter_num}: {chapter_title.upper()}",
        font=font_title,
        fill=(255, 255, 255, 255)
    )

    draw.text(
        (pill_x + 45, pill_y + 35),
        f"{timestamp_str} · Mwalimu Cloud (AZ-900 Study Buddy)",
        font=font_sub,
        fill=(230, 239, 238, 220)
    )

    # Composite
    final_im = Image.alpha_composite(im, overlay).convert("RGB")
    final_im.save(output_path, "PNG")
    print(f"Saved overlay to {output_path}")

if __name__ == "__main__":
    os.makedirs("/tmp/test_overlays", exist_ok=True)
    add_chapter_overlay(
        "video_assets/screenshots/01_landing.png",
        1,
        "The Problem & Introduction",
        "0:00 - 0:25",
        "/tmp/test_overlays/01_test.png"
    )
