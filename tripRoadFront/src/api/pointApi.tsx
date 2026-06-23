import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/point`;

// 적립금 잔액 조회 — GET /api/point/{userId}
// 호출처: holdComponent 진입 시 "보유 적립금" 표시
// 신규 유저는 백이 pointBalance=0, updatedAt=null로 응답
export const getBalance = async (userId: number) => {
  console.log('getBalance userId->', userId);
  const res = await axios.get(`${prefix}/${userId}`);
  console.log('getBalance res->', res);
  return res.data as UserPointBalance;
}

// 적립금 이력 조회 — GET /api/point/{userId}/history
// 호출처: 마이페이지 적립금 이력 list
// 백이 created_at DESC 정렬해 응답
export const getHistory = async (userId: number) => {
  console.log('getHistory userId->', userId);
  const res = await axios.get(`${prefix}/${userId}/history`);
  console.log('getHistory res->', res);
  return res.data as UserPointHistory[];
}