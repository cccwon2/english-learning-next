# 초등학생을 위한 영어 학습 웹 애플리케이션

<p align="center">
  <img src="./public/images/logo.png" alt="영어 학습 앱 로고" width="200">
</p>

![Next.js Version](https://img.shields.io/badge/Next.js-14.2.15-blue)
![License](https://img.shields.io/badge/License-Apache%202.0-green)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

이 프로젝트는 [Next.js](https://nextjs.org)를 기반으로 한 초등학교 5, 6학년을 대상으로 하는 영어 학습 웹 애플리케이션입니다.

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [사용된 주요 기술](#사용된-주요-기술)
- [시작하기](#시작하기)
- [개발 가이드라인](#개발-가이드라인)
- [프로젝트 문서](#프로젝트-문서)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [라이선스](#라이선스)

## 프로젝트 개요

자세한 프로젝트 개요는 [프로젝트 개요 문서](docs/project-overview.md)를 참조하세요.

## 시작하기

먼저, 개발 서버를 실행하세요:

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

```bash
bash
npm run dev
or
yarn dev
or
pnpm dev
or
bun dev
```

## 주요 기능

- OpenAI API를 활용한 맞춤형 영어 학습
- 음성 인식 및 텍스트 음성 변환 기능
- 한국어 ↔ 영어 번역 기능
- 학습 진행 상황 시각화
- 사용자 친화적인 UI (shadcn UI 사용)

## 사용된 주요 기술

- Next.js
- TypeScript
- OpenAI API
- DeepL API
- Prisma
- Supabase
- React Query
- Framer Motion
- Chart.js
- i18next
- shadcn UI
- Tailwind CSS

## 개발 가이드라인

이 프로젝트는 1인 개발 프로젝트이지만, 코드의 일관성과 품질을 유지하기 위해 다음 가이드라인을 따릅니다:

- 코드 스타일: Prettier와 ESLint를 사용하여 일관된 코드 스타일을 유지합니다.
- 커밋 메시지: 명확하고 설명적인 커밋 메시지를 작성합니다.
- 문서화: 주요 함수와 컴포넌트에 대해 JSDoc 스타일의 주석을 사용합니다.
- 테스트: 가능한 한 단위 테스트를 작성하여 코드의 안정성을 유지합니다.

## 프로젝트 문서

- [API 문서](docs/api-documentation.md)
- [데이터베이스 스키마](docs/database-schema.md)
- [변경 이력](docs/changelog.md)

## 설치 및 실행 방법

자세한 설치 및 실행 방법은 [프로젝트 개요 문서](docs/project-overview.md#설치-및-실행-방법)를 참조하세요.

## 라이선스

이 프로젝트는 Apache 라이선스를 따르고 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.
