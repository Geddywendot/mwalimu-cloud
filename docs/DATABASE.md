# Database

```mermaid
erDiagram
  profiles ||--o{ attempts : "user_id"
  topics ||--o{ questions : has
  topics ||--o{ explanations : has
  questions ||--o{ attempts : answered
  questions ||--o{ review_state : scheduled
  profiles { uuid id PK
    text language
    date exam_date }
  topics { text id PK
    text domain
    text title }
  explanations { uuid id PK
    text topic_id FK
    text language
    text level
    jsonb content }
  questions { uuid id PK
    text topic_id FK
    jsonb body
    bool flagged }
  attempts { uuid id PK
    uuid user_id
    uuid question_id FK
    bool is_correct }
  review_state { uuid user_id PK
    uuid question_id PK
    int box
    timestamptz due_at }
  ai_logs { uuid id PK
    text function_name
    text caller_hash
    int tokens_in }
```

## RLS summary
| Table | Clients can |
|---|---|
| profiles, attempts, review_state | read/write only their own rows |
| topics, explanations | read only |
| questions | read only, and only unflagged rows; flag via `flag_question()` |
| ai_logs | nothing (RLS on, no policies; service role only) |

Writes to topics, explanations and questions happen in Edge Functions with the service role. `ai_logs.caller_hash` is a salted hash, never a raw id or IP.
