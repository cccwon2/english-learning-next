# 데이터베이스 스키마

## User 테이블

| 컬럼명     | 타입       | 설명                   |
| ---------- | ---------- | ---------------------- |
| id         | Int        | 기본 키, 자동 증가     |
| name       | String     | 사용자 이름            |
| grade      | Int        | 학년                   |
| class      | Int        | 반                     |
| nameSuffix | NameSuffix | 이름 접미사 (A 또는 B) |
| createdAt  | DateTime   | 생성 시간              |

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

## 기타 테이블 및 관계 설명

### NameSuffix 열거형

`NameSuffix`는 `User` 테이블에서 사용되는 열거형으로, 다음 값들을 가질 수 있습니다:

- A
- B

이는 동명이인을 구분하기 위해 사용됩니다.

### 테이블 간 관계

1. User와 Conversation의 관계:

   - 일대다 관계
   - 한 명의 사용자(User)는 여러 개의 대화(Conversation)를 가질 수 있습니다.
   - `Conversation` 테이블의 `userId`는 `User` 테이블의 `id`를 참조합니다.

2. Conversation과 ConversationTranslation의 관계:
   - 일대일 관계
   - 각 대화(Conversation)는 하나의 번역(ConversationTranslation)을 가집니다.
   - `ConversationTranslation` 테이블의 `conversationId`는 `Conversation` 테이블의 `id`를 참조합니다.

### 인덱스 및 제약 조건

1. User 테이블:

   - `(grade, class, name, nameSuffix)`에 대해 유니크 제약 조건이 설정되어 있습니다.
   - 이는 같은 학년, 반에 동일한 이름과 접미사를 가진 사용자가 중복되지 않도록 합니다.

2. Conversation 테이블:

   - `userId`에 대해 인덱스가 생성되어 있어, 특정 사용자의 대화를 빠르게 조회할 수 있습니다.

3. ConversationTranslation 테이블:
   - `conversationId`에 대해 유니크 제약 조건이 설정되어 있어, 각 대화는 하나의 번역만을 가질 수 있습니다.

### 데이터 타입 설명

- `Int`: 정수형 데이터 타입으로, 주로 ID나 숫자 값을 저장합니다.
- `String`: 문자열 데이터 타입으로, 이름이나 메시지 등의 텍스트를 저장합니다.
- `Boolean`: 참/거짓 값을 저장하는 데이터 타입입니다.
- `DateTime`: 날짜와 시간 정보를 저장하는 데이터 타입입니다.
- `String?`: 널(null) 값을 허용하는 문자열 데이터 타입입니다.

이 스키마 설계는 사용자, 대화, 그리고 대화의 번역을 효율적으로 관리할 수 있도록 구성되어 있습니다. 각 테이블은 명확한 목적을 가지고 있으며, 테이블 간의 관계를 통해 데이터의 일관성과 무결성을 유지합니다.
