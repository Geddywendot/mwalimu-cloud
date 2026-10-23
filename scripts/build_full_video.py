import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

FONT_BOLD = "/usr/share/fonts/julietaula-montserrat-fonts/Montserrat-Bold.otf"
FONT_REG = "/usr/share/fonts/julietaula-montserrat-fonts/Montserrat-Regular.otf"

BASE_DIR = os.getcwd()
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "video_assets/screenshots")
AUDIO_DIR = os.path.join(BASE_DIR, "video_assets/audio")
FRAMES_DIR = os.path.join(BASE_DIR, "video_assets/frames")
CLIPS_DIR = os.path.join(BASE_DIR, "video_assets/clips")
OUTPUT_VIDEO = os.path.join(BASE_DIR, "docs/mwalimu-cloud-demo.mp4")

os.makedirs(FRAMES_DIR, exist_ok=True)
os.makedirs(CLIPS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_VIDEO), exist_ok=True)

def create_frame(src_png, chapter_num, title, subtitle, out_name):
    src_path = os.path.join(SCREENSHOTS_DIR, src_png)
    dst_path = os.path.join(FRAMES_DIR, out_name)

    im = Image.open(src_path).convert("RGBA")
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Top floating banner pill
    pill_w = 700
    pill_h = 64
    pill_x = im.width - pill_w - 30
    pill_y = 20

    # Rounded rectangle background
    draw.rounded_rectangle(
        [(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)],
        radius=12,
        fill=(14, 59, 67, 245),
        outline=(27, 127, 140, 255),
        width=2
    )

    # Gold dot
    dot_r = 7
    dot_cx = pill_x + 28
    dot_cy = pill_y + pill_h // 2
    draw.ellipse(
        [(dot_cx - dot_r, dot_cy - dot_r), (dot_cx + dot_r, dot_cy + dot_r)],
        fill=(244, 180, 26, 255)
    )

    # Fonts
    font_title = ImageFont.truetype(FONT_BOLD, 17)
    font_sub = ImageFont.truetype(FONT_REG, 13)

    # Text
    draw.text(
        (pill_x + 50, pill_y + 12),
        f"SCENE {chapter_num}: {title.upper()}",
        font=font_title,
        fill=(255, 255, 255, 255)
    )

    draw.text(
        (pill_x + 50, pill_y + 36),
        subtitle,
        font=font_sub,
        fill=(230, 239, 238, 220)
    )

    # Subtle bottom bar
    bar_h = 32
    draw.rectangle(
        [(0, im.height - bar_h), (im.width, im.height)],
        fill=(14, 59, 67, 230)
    )
    font_footer = ImageFont.truetype(FONT_REG, 12)
    footer_text = "Mwalimu Cloud · Curated Content Edition · Unofficial AZ-900 Study Buddy · Free & Offline-Ready"
    draw.text(
        (30, im.height - bar_h + 8),
        footer_text,
        font=font_footer,
        fill=(230, 239, 238, 200)
    )

    final_im = Image.alpha_composite(im, overlay).convert("RGB")
    final_im.save(dst_path, "PNG")
    print(f"Generated frame: {out_name}")
    return dst_path

def build_segment_clip(name, audio_name, frame_specs):
    audio_path = os.path.join(AUDIO_DIR, audio_name)
    clip_path = os.path.join(CLIPS_DIR, f"{name}.mp4")

    # If single frame
    if len(frame_specs) == 1:
        frame_path = frame_specs[0][0]
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", frame_path,
            "-i", audio_path,
            "-c:v", "libopenh264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            clip_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    else:
        # Multiple frames with concat script
        concat_file = os.path.join(CLIPS_DIR, f"{name}_concat.txt")
        with open(concat_file, "w") as f:
            f.write("ffconcat version 1.0\n")
            for frame_path, dur in frame_specs:
                f.write(f"file '{frame_path}'\n")
                f.write(f"duration {dur}\n")
            # Concat demuxer needs last file repeated
            f.write(f"file '{frame_specs[-1][0]}'\n")

        cmd = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", concat_file,
            "-i", audio_path,
            "-c:v", "libopenh264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            clip_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    print(f"Built clip: {clip_path} ({os.path.getsize(clip_path)} bytes)")
    return clip_path

def main():
    print("Step 1: Creating polished video frames...")
    f1 = create_frame(
        "01_landing.png", 1,
        "The Problem & Introduction",
        "[0:00 - 0:25] Relatable Azure Fundamentals for Africa",
        "frame_01.png"
    )

    f2a = create_frame(
        "02_topics.png", 2,
        "Instant Guest Start & Honesty Badges",
        "[0:25 - 0:50] Topic Map & Curated Content Badge",
        "frame_02a.png"
    )
    f2b = create_frame(
        "02b_swahili.png", 2,
        "Kiswahili Localization & Review Badge",
        "[0:25 - 0:50] Native-Speaker Translation Review",
        "frame_02b.png"
    )

    f3 = create_frame(
        "03_explain.png", 3,
        "Explain Mode & African Analogies",
        "[0:50 - 1:35] Matatu Scalability Analogy & Follow-Up Chips",
        "frame_03.png"
    )

    f4a = create_frame(
        "04_quiz_question.png", 4,
        "Practice Quiz Engine",
        "[1:35 - 2:15] Shuffled Options & Scenario-Based Questions",
        "frame_04a.png"
    )
    f4b = create_frame(
        "04_quiz_feedback.png", 4,
        "Instant Deep Feedback & Reporting",
        "[1:35 - 2:15] Explanations for All Wrong Options & Report Button",
        "frame_04b.png"
    )

    f5a = create_frame(
        "07_revision.png", 5,
        "Leitner Spaced Repetition",
        "[2:15 - 2:45] 5-Box Leitner Engine & Daily Revision",
        "frame_05a.png"
    )
    f5b = create_frame(
        "05_dashboard.png", 5,
        "Readiness Dashboard",
        "[2:15 - 2:45] Domain Weights, Accuracy Trends & Weak Topics",
        "frame_05b.png"
    )
    f5c = create_frame(
        "06_planner.png", 5,
        "Adaptive Study Planner",
        "[2:15 - 2:45] Day-by-Day Roadmap Prioritizing Weak Areas",
        "frame_05c.png"
    )

    f6 = create_frame(
        "01_landing.png", 6,
        "Offline PWA Architecture & Closing",
        "[2:45 - 3:00] Zero Keys, 100% Offline-Ready & Honest Pedagogy",
        "frame_06.png"
    )

    print("\nStep 2: Building synchronized video clips for all 6 segments...")
    clips = []
    # Seg 1: 38.90s
    clips.append(build_segment_clip("clip1", "seg1.wav", [(f1, 38.90)]))

    # Seg 2: 30.42s (f2a: 15s, f2b: 15.42s)
    clips.append(build_segment_clip("clip2", "seg2.wav", [(f2a, 15.0), (f2b, 15.42)]))

    # Seg 3: 48.74s
    clips.append(build_segment_clip("clip3", "seg3.wav", [(f3, 48.74)]))

    # Seg 4: 31.46s (f4a: 11s, f4b: 20.46s)
    clips.append(build_segment_clip("clip4", "seg4.wav", [(f4a, 11.0), (f4b, 20.46)]))

    # Seg 5: 34.18s (f5a: 11s, f5b: 12s, f5c: 11.18s)
    clips.append(build_segment_clip("clip5", "seg5.wav", [(f5a, 11.0), (f5b, 12.0), (f5c, 11.18)]))

    # Seg 6: 32.84s
    clips.append(build_segment_clip("clip6", "seg6.wav", [(f6, 32.84)]))

    print("\nStep 3: Concatenating all clips into final demo video...")
    final_concat_txt = os.path.join(CLIPS_DIR, "final_concat.txt")
    with open(final_concat_txt, "w") as f:
        for c in clips:
            f.write(f"file '{c}'\n")

    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", final_concat_txt,
        "-c", "copy",
        OUTPUT_VIDEO
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    print(f"\nFINAL DEMO VIDEO SUCCESSFULLY GENERATED:")
    print(f"Path: {OUTPUT_VIDEO}")
    print(f"File size: {os.path.getsize(OUTPUT_VIDEO):,} bytes")

    # Probe duration
    cmd_probe = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        OUTPUT_VIDEO
    ]
    res = subprocess.run(cmd_probe, stdout=subprocess.PIPE, text=True)
    dur = float(res.stdout.strip())
    print(f"Total Video Duration: {dur:.2f} seconds ({dur/60:.2f} minutes)")

if __name__ == "__main__":
    main()
