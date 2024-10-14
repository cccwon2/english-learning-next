# 영어 학습 채팅봇 프로젝트 개요

## 소개

이 프로젝트는 초등학생을 위한 영어 학습 채팅봇 웹 애플리케이션입니다. OpenAI의 GPT-4를 활용하여 맞춤형 영어 학습 경험을 제공합니다.

## 주요 기능

- 사용자 인증 및 프로필 관리
- 실시간 영어 대화 기능
- 한국어-영어 번역 기능
- 대화 기록 저장 및 조회
- 음성 인식 기능

## 기술 스택

- Frontend: Next.js 14.2.15, React 18, TypeScript
- Backend: Next.js API Routes
- Database: PostgreSQL (Supabase)
- ORM: Prisma
- AI: OpenAI GPT-4
- 번역: DeepL API
- 상태 관리: Jotai, React Query (TanStack Query)
- UI 컴포넌트: Radix UI, shadcn/ui
- 스타일링: Tailwind CSS
- 애니메이션: Framer Motion
- 국제화: next-i18next
- 폼 관리: react-hook-form
- 데이터 검증: Zod
- 차트: Chart.js, react-chartjs-2
- 날짜 관리: date-fns, react-day-picker

## 프로젝트 구조

english-learning-next/
├── docs/ # 프로젝트 문서
├── prisma/ # Prisma 스키마 및 마이그레이션
├── public/ # 정적 파일
├── src/
│ ├── app/ # Next.js 14 App Router
│ │ └── api/ # API 라우트
│ ├── components/ # React 컴포넌트
│ ├── lib/ # 유틸리티 함수 및 설정
│ ├── styles/ # 전역 스타일
│ └── types/ # TypeScript 타입 정의
├── .env # 환경 변수
├── .gitignore
├── next.config.js # Next.js 설정
├── package.json
├── README.md
└── tsconfig.json # TypeScript 설정

## 설치 및 실행 방법

1. 저장소 클론:

   ```
   git clone https://github.com/your-username/english-learning-next.git
   cd english-learning-next
   ```

2. 의존성 설치:

   ```
   npm install
   ```

3. 환경 변수 설정:
   `.env` 파일을 생성하고 다음 변수들을 설정합니다:

   ```
   DATABASE_URL="your-postgresql-connection-string"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   OPENAI_API_KEY="your-openai-api-key"
   DEEPL_API_KEY="your-deepl-api-key"
   ```

4. 데이터베이스 마이그레이션:

   ```
   npx prisma migrate dev
   ```

5. 개발 서버 실행:

   ```
   npm run dev
   ```

6. 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인합니다.

프로덕션 배포를 위해서는:

1. 프로덕션 빌드 생성:

   ```
   npm run build
   ```

2. 프로덕션 서버 시작:
   ```
   npm start
   ```

주의:

- 프로덕션 환경에서는 적절한 보안 설정과 환경 변수 관리가 필요합니다.
- Supabase와 OpenAI API 키는 반드시 안전하게 관리해야 합니다.
- 실제 배포 시에는 SSL/TLS 설정을 통해 HTTPS를 사용해야 합니다.
