// 회원 기본 정보 (백엔드 User01Dto 기준)
interface User01 {
  userId: number
  loginId: string
  password?: string
  nickname: string
  name: string
  email: string
  phone?: string
  profileImage?: string
  createdAt?: string
  role?: number
  userStatus?: number
}

// 회원가입 요청 (addComponent에서 사용)
interface User01Join {
  loginId: string
  password: string
  nickname: string
  name: string
  email: string
  phone?: string
  files?: File[]
}

// 로그인 요청
interface User01Login {
  loginId: string
  password: string
}

// 로그인 응답
interface User01LoginResponse {
  result: number
  USER_ID: number
  loginId: string
  NICKNAME: string
  NAME: string
  role?: number
}

// 회원정보 수정 요청
interface User01Modify {
  userId: number
  nickname?: string
  name?: string
  email?: string
  phone?: string
}
