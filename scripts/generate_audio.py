import os
import subprocess
from gtts import gTTS

NARRATIONS = {
    "seg1": (
        "Jambo! Studying for the Microsoft Azure Fundamentals exam, AZ-900, often feels daunting. "
        "The documentation is full of abstract corporate jargon, and most study platforms assume you live next to a Western enterprise datacenter with unlimited high-speed broadband. "
        "We built Mwalimu Cloud — an unofficial study buddy designed for learners across Africa. "
        "It explains Azure concepts through things you already know, offers over one hundred and twenty original scenario questions, and works completely offline with zero API keys or server costs."
    ),
    "seg2": (
        "Notice we don't force learners to create accounts or pay for an AI key. I tap Continue as guest, and I'm immediately in. "
        "In the header, you will see a badge that says Curated content. We believe in radical honesty: this edition uses pre-written, AI-assisted, human-reviewed content rather than unpredictable live AI calls. "
        "If we toggle to Kiswahili, you will also see a badge noting that translations are under ongoing native-speaker review."
    ),
    "seg3": (
        "Let's open Benefits of cloud services. "
        "Instead of just dry definitions, Mwalimu Cloud explains that Scalability and Elasticity are like a matatu route: adding vehicles during rush hour and parking them at midday so you only pay for what you use. "
        "But we never let the analogy replace the truth. Every card displays the official definition side by side with the analogy, plus a crucial section: Where it breaks down — noting that unlike matatus, cloud servers can spin up automatically in seconds across continents. "
        "If I need it even plainer, I toggle Explain it simpler. And below, instead of a broken chatbot, I have tappable Common Questions chips that reveal answers to edge cases instantly."
    ),
    "seg4": (
        "Now let's test our retention with Quiz me on this. "
        "I choose a five-question quiz. Options are shuffled every session to prevent rote memorization. Let's submit an answer. "
        "Notice the feedback panel: it doesn't just say Wrong or Correct. It explains why the right answer is right, and provides a distinct explanation for every single wrong option. "
        "If a question feels questionable, a learner can tap Report this question to flag it for audit."
    ),
    "seg5": (
        "Missed questions aren't forgotten. They automatically feed into our Leitner Spaced Repetition engine, appearing in Today's Revision at one, three, seven, and fourteen-day intervals until mastered. "
        "On the Readiness Dashboard, learners see their accuracy mapped against official AZ-900 domain weights, a progress trend line, and an exam countdown with daily question targets. "
        "And for learners on a timeline, our Study Planner generates an adaptive, day-by-day roadmap prioritizing their weakest areas."
    ),
    "seg6": (
        "Best of all: Mwalimu Cloud is an offline Progressive Web App. A learner can load this once on their phone, take the bus home without data, and keep studying. "
        "Mwalimu Cloud proves that world-class cloud education doesn't require expensive AI subscriptions — just thoughtful pedagogy, cultural resonance, and rigorous engineering. "
        "As noted on every page: Unofficial study tool. Not affiliated with or endorsed by Microsoft. Asante sana!"
    ),
}

def generate_all():
    out_dir = os.path.join(os.getcwd(), "video_assets/audio")
    os.makedirs(out_dir, exist_ok=True)

    durations = {}

    for key, text in NARRATIONS.items():
        mp3_path = os.path.join(out_dir, f"{key}.mp3")
        print(f"Generating audio for {key}...")
        tts = gTTS(text=text, lang="en", tld="co.ke", slow=False)
        tts.save(mp3_path)

        # Probe duration with ffprobe
        cmd = [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            mp3_path
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True)
        dur = float(res.stdout.strip())
        durations[key] = dur
        print(f"  -> {key}: {dur:.2f} seconds ({os.path.getsize(mp3_path)} bytes)")

    total_sec = sum(durations.values())
    print(f"\nTotal narration duration: {total_sec:.2f} seconds ({total_sec/60:.2f} minutes)")

if __name__ == "__main__":
    generate_all()
