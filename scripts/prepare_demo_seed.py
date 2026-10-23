import json
import time

def build_seed_data():
    with open('src/content/questions.json', 'r') as f:
        questions = json.load(f)

    # Topic list
    topics = sorted(list(set(q['topic_id'] for q in questions)))
    
    # Bank of questions indexed by ID
    bank = {q['id']: q for q in questions}

    # Generate 45 realistic attempts spread across 10 days
    now = int(time.time() * 1000)
    day_ms = 86400 * 1000
    attempts = []
    review = {}

    # Weak topics: governance-methodologies, identity-services
    weak_topics = {'governance-methodologies', 'identity-services'}

    for idx, q in enumerate(questions[:45]):
        topic = q['topic_id']
        is_weak = topic in weak_topics
        # 85% correct for normal topics, 40% for weak topics
        is_correct = (idx % 7 != 0) if not is_weak else (idx % 2 == 0)
        
        attempt_time = now - (idx % 10) * day_ms + (idx * 60000)
        attempts.append({
            'questionId': q['id'],
            'topicId': topic,
            'isCorrect': is_correct,
            'at': attempt_time
        })

        # Put into Leitner review box
        box = 1 if not is_correct else ((idx % 4) + 2)
        # Make a few questions due today (dueAt in the past)
        due_at = (now - 3600000) if (idx % 4 == 0) else (now + box * day_ms)
        review[q['id']] = {
            'box': box,
            'dueAt': due_at,
            'lastReviewedAt': attempt_time
        }

    progress = {
        'attempts': attempts,
        'review': review,
        'bank': bank
    }

    return progress

if __name__ == '__main__':
    progress = build_seed_data()
    with open('/tmp/mwalimu_seed.json', 'w') as f:
        json.dump(progress, f)
    print(f"Generated seed data: {len(progress['attempts'])} attempts, {len(progress['review'])} reviews.")
