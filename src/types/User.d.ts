export interface User {
  id: string; // 사용자 고유 식별자
  name: string;
  grade: number;
  class: number;
  email?: string; // 선택적 이메일 필드
  created_at?: string; // 계정 생성 날짜
  updated_at?: string; // 계정 정보 수정 날짜
  role?: "student" | "teacher" | "admin"; // 사용자 역할
  profile_image?: string; // 프로필 이미지 URL
  last_login?: string; // 마지막 로그인 시간
}
