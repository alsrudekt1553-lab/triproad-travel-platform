import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/payment`;

export const postReady = async (req: PaymentReadyRequest) => {
  console.log('postReady req->', req);
  const res = await axios.post(`${prefix}/ready`, req);
  console.log('postReady res->', res);
  return res.data as PaymentReadyResponse;
}

export const postApprove = async (req: PaymentApproveRequest) => {
  console.log('postApprove req->', req);
  const res = await axios.post(`${prefix}/approve`, req);
  console.log('postApprove res->', res);
  return res.data as PaymentApproveResponse;
}

export const getPaymentByBookingId = async (bookingId: number) => {
  console.log('getPaymentByBookingId bookingId->', bookingId);
  const res = await axios.get(`${prefix}/${bookingId}`);
  console.log('getPaymentByBookingId res->', res);
  return res.data as PaymentInfo;
}

export const getPaymentsByUser = async (userId: number) => {
  console.log('getPaymentsByUser userId->', userId);
  const res = await axios.get(`${prefix}/user/${userId}`);
  console.log('getPaymentsByUser res->', res);
  return res.data as PaymentInfo[];
}

export const deleteCancel = async (bookingId: number) => {
  console.log('deleteCancel bookingId->', bookingId);
  const res = await axios.delete(`${prefix}/cancel/${bookingId}`);
  console.log('deleteCancel res->', res);
  return res.data;
}

export const postRefund = async (bookingId: number) => {
  console.log('postRefund bookingId->', bookingId);
  const res = await axios.post(`${prefix}/refund/${bookingId}`, null);
  console.log('postRefund res->', res);
  return res.data;
}