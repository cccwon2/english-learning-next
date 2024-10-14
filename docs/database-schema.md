# 데이터베이스 스키마

## Conversation 테이블

| 컬럼명          | 타입     | 설명               |
| --------------- | -------- | ------------------ |
| id              | Int      | 기본 키, 자동 증가 |
| message         | String   | 대화 메시지        |
| created_at      | DateTime | 생성 시간          |
| updated_at      | DateTime | 수정 시간          |
| is_user_message | Boolean  | 사용자 메시지 여부 |
| user_id         | String   | 사용자 ID (UUID)   |

## ConversationTranslation 테이블

| 컬럼명              | 타입     | 설명                     |
| ------------------- | -------- | ------------------------ |
| id                  | Int      | 기본 키, 자동 증가       |
| response            | String?  | AI 응답 (nullable)       |
| language            | String?  | 언어 (nullable)          |
| conversation_id     | Int      | 대화 ID (외래 키)        |
| translated_message  | String?  | 번역된 메시지 (nullable) |
| translated_response | String?  | 번역된 응답 (nullable)   |
| created_at          | DateTime | 생성 시간                |
| updated_at          | DateTime | 수정 시간                |

### 테이블 간 관계

1. Conversation과 ConversationTranslation의 관계:
   - 일대일 관계
   - 각 대화(Conversation)는 하나의 번역(ConversationTranslation)을 가질 수 있습니다.
   - `ConversationTranslation` 테이블의 `conversation_id`는 `Conversation` 테이블의 `id`를 참조합니다.

### 인덱스 및 제약 조건

1. Conversation 테이블:

   - `user_id`에 대해 인덱스가 생성되어 있어, 특정 사용자의 대화를 빠르게 조회할 수 있습니다.

2. ConversationTranslation 테이블:
   - `conversation_id`에 대해 유니크 제약 조건이 설정되어 있어, 각 대화는 하나의 번역만을 가질 수 있습니다.
   - `conversation_id`에 대해 인덱스가 생성되어 있어, 관련 대화의 번역을 빠르게 조회할 수 있습니다.

### 스키마 정보

- 데이터베이스 제공자: PostgreSQL
- 스키마 이름: public

### 주의사항

- 날짜/시간 필드(`created_at`, `updated_at`)는 PostgreSQL의 `timestamptz` 타입을 사용하여 시간대 정보를 포함합니다.
- `user_id` 필드는 UUID 타입을 사용하여 사용자를 식별합니다.
- 번역 관련 필드들(`response`, `translated_message`, `translated_response`)은 nullable로 설정되어 있어, 필요에 따라 값을 저장하지 않을 수 있습니다.

이 스키마 설계는 사용자의 대화와 그에 대한 번역을 효율적으로 저장하고 관리할 수 있도록 구성되어 있습니다. Prisma ORM을 통해 이 스키마를 사용하여 데이터베이스 작업을 수행할 수 있습니다.
