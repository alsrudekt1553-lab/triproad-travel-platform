import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/point`;

export const getBalance = async (userId: number) => {
  console.log('getBalance userId->', userId);
  const res = await axios.get(`${prefix}/${userId}`);
  console.log('getBalance res->', res);
  return res.data as UserPointBalance;
}

export const getHistory = async (userId: number) => {
  console.log('getHistory userId->', userId);
  const res = await axios.get(`${prefix}/${userId}/history`);
  console.log('getHistory res->', res);
  return res.data as UserPointHistory[];
}