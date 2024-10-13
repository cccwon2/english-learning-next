# 데이터베이스 스키마

## Conversation 테이블

| 컬럼명        | 타입     | 설명                |
| ------------- | -------- | ------------------- |
| id            | Int      | 기본 키, 자동 증가  |
| userId        | Int      | 사용자 ID (외래 키) |
| message       | String   | 대화 메시지         |
| isUserMessage | Boolean  | 사용자 메시지 여부  |
| createdAt     | DateTime | 생성 시간           |

## ConversationTranslation 테이블

| 컬럼명             | 타입    | 설명               |
| ------------------ | ------- | ------------------ |
| id                 | Int     | 기본 키, 자동 증가 |
| conversationId     | Int     | 대화 ID (외래 키)  |
| translatedMessage  | String? | 번역된 메시지      |
| response           | String? | AI 응답            |
| translatedResponse | String? | 번역된 AI 응답     |
| language           | String? | 언어               |

### 테이블 간 관계

1. Conversation과 ConversationTranslation의 관계:
   - 일대일 관계
   - 각 대화(Conversation)는 하나의 번역(ConversationTranslation)을 가집니다.
   - `ConversationTranslation` 테이블의 `conversationId`는 `Conversation` 테이블의 `id`를 참조합니다.

### 인덱스 및 제약 조건

1. Conversation 테이블:

   - `userId`에 대해 인덱스가 생성되어 있어, 특정 사용자의 대화를 빠르게 조회할 수 있습니다.

2. ConversationTranslation 테이블:
   - `conversationId`에 대해 유니크 제약 조건이 설정되어 있어, 각 대화는 하나의 번역만을 가질 수 있습니다.

### 데이터 타입 설명

- `Int`: 정수형 데이터 타입으로, 주로 ID나 숫자 값을 저장합니다.
- `String`: 문자열 데이터 타입으로, 이름이나 메시지 등의 텍스트를 저장합니다.
- `Boolean`: 참/거짓 값을 저장하는 데이터 타입입니다.
- `DateTime`: 날짜와 시간 정보를 저장하는 데이터 타입입니다.
- `String?`: 널(null) 값을 허용하는 문자열 데이터 타입입니다.

이 스키마 설계는 사용자, 대화, 그리고 대화의 번역을 효율적으로 관리할 수 있도록 구성되어 있습니다. 각 테이블은 명확한 목적을 가지고 있으며, 테이블 간의 관계를 통해 데이터의 일관성과 무결성을 유지합니다.
