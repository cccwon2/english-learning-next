import { atom } from "jotai";

export interface User {
  id: string;
  email: string;
  // 필요한 다른 사용자 정보 필드
}

export const userAtom = atom<User | null>(null);
