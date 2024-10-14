# API 문서

## 채팅 API

- 엔드포인트: `/api/chat`
- 메소드: POST
- 요청 본문:
  ```json
  {
    "message": "사용자 메시지",
    "userId": "사용자 ID",
    "grade": "학년"
  }
  ```
- 응답:
  ```json
  {
    "originalMessage": "원본 메시지",
    "englishMessage": "영어로 번역된 메시지",
    "englishResponse": "AI의 영어 응답",
    "koreanTranslation": "한국어로 번역된 AI 응답"
  }
  ```

## 메시지 조회 API

- 엔드포인트: `/api/messages`
- 메소드: GET
- 쿼리 파라미터:
  - `userId`: 사용자 ID
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 메시지 수 (기본값: 20)
- 응답:
  ```json
  {
    "messages": [
      {
        "id": "메시지 ID",
        "content": "메시지 내용",
        "isUser": true/false,
        "translation": "번역된 내용",
        "createdAt": "생성 시간"
      }
    ],
    "hasMore": true/false
  }
  ```

## 음성-텍스트 변환 API

- 엔드포인트: `/api/speech-to-text`
- 메소드: POST
- 요청 본문: `FormData` (audio 파일 포함)
- 응답:
  ```json
  {
    "text": "인식된 한국어 텍스트",
    "englishText": "영어로 번역된 텍스트"
  }
  ```

## 인증 API

### 로그인

- 엔드포인트: `/api/auth/signin`
- 메소드: POST
- 요청 본문:
  ```json
  {
    "email": "사용자 이메일",
    "password": "비밀번호"
  }
  ```
- 응답:
  ```json
  {
    "message": "로그인 성공",
    "user": {
      // 사용자 정보
    }
  }
  ```

### 회원가입

- 엔드포인트: `/api/auth/signup`
- 메소드: POST
- 요청 본문:
  ```json
  {
    "email": "사용자 이메일",
    "password": "비밀번호"
  }
  ```
- 응답:
  ```json
  {
    "message": "회원가입이 완료되었습니다. 이메일을 확인해 주세요."
  }
  ```

### 로그아웃

- 엔드포인트: `/api/auth/logout`
- 메소드: POST
- 응답:
  ```json
  {
    "success": true,
    "message": "로그아웃 되었습니다."
  }
  ```

각 API는 오류 발생 시 적절한 HTTP 상태 코드와 함께 오류 메시지를 반환합니다. 모든 API 요청에는 적절한 인증이 필요할 수 있으며, 이는 서버 측 구현에 따라 달라질 수 있습니다.
