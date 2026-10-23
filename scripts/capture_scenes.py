import os
import shutil
import subprocess
from PIL import Image

SCENES = [
    ('01_landing.png', 'http://127.0.0.1:4173/?clear=1'),
    ('02_topics.png', 'http://127.0.0.1:4173/topics?guest=1'),
    ('02b_swahili.png', 'http://127.0.0.1:4173/topics?guest=1&lang=sw'),
    ('03_explain.png', 'http://127.0.0.1:4173/explain/cloud-benefits?guest=1'),
    ('04_quiz_question.png', 'http://127.0.0.1:4173/quiz?topic=cloud-benefits&guest=1&autostart=1'),
    ('04_quiz_feedback.png', 'http://127.0.0.1:4173/quiz?topic=cloud-benefits&guest=1&autostart=1&demo_checked=1'),
    ('05_dashboard.png', 'http://127.0.0.1:4173/dashboard?guest=1&seed=1'),
    ('06_planner.png', 'http://127.0.0.1:4173/planner?guest=1&seed=1'),
    ('07_revision.png', 'http://127.0.0.1:4173/revision?guest=1&seed=1'),
]

def capture_all():
    pwd = os.getcwd()
    out_dir = os.path.join(pwd, 'video_assets/screenshots')
    os.makedirs(out_dir, exist_ok=True)

    for filename, url in SCENES:
        prof_dir = f'/tmp/ffprof_{filename}'
        if os.path.exists(prof_dir):
            shutil.rmtree(prof_dir)
        os.makedirs(prof_dir, exist_ok=True)

        target_path = os.path.join(out_dir, filename)
        if os.path.exists(target_path):
            os.remove(target_path)

        cmd = [
            'firefox',
            '--headless',
            '--profile', prof_dir,
            '--no-remote',
            '--window-size', '1920,1080',
            '--screenshot', target_path,
            url
        ]

        print(f"Capturing {filename} from {url}...")
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        if os.path.exists(target_path):
            im = Image.open(target_path)
            bg = im.getpixel((10, 10))
            non_bg = sum(1 for p in im.getdata() if p != bg)
            print(f"  -> SUCCESS {filename}: {os.path.getsize(target_path)} bytes, non-bg pixels: {non_bg}")
        else:
            print(f"  -> FAILED {filename}!")

if __name__ == '__main__':
    capture_all()
