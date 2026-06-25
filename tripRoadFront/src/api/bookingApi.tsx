import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/booking`;

export const postHold = async (req: BookingHoldRequest) => {
  console.log('postHold req->', req);
  const res = await axios.post(`${prefix}/hold`, req);
  console.log('postHold res->', res);
  return res.data as BookingHoldResponse;
}

export const getBookingsByUser = async (userId: number) => {
  console.log('getBookingsByUser userId->', userId);
  const res = await axios.get(`${prefix}/user/${userId}`);
  console.log('getBookingsByUser res->', res);
  return res.data as BookingInfo[];
}

export const deleteRelease = async (bookingId: number) => {
  console.log('deleteRelease bookingId->', bookingId);
  const res = await axios.delete(`${prefix}/release/${bookingId}`);
  console.log('deleteRelease res->', res);
  return res.data;
}

export const getScheduleForBooking = async (scheduleId: number) => {
  console.log('getScheduleForBooking scheduleId->', scheduleId);
  const res = await axios.get(`${prefix}/schedule/${scheduleId}`);
  console.log('getScheduleForBooking res->', res);
  return res.data as BookingScheduleView;
}

export const putConfirm = async (bookingId: number) => {
  console.log('putConfirm bookingId->', bookingId);
  const res = await axios.put(`${prefix}/confirm/${bookingId}`, null);
  console.log('putConfirm res->', res);
  return res.data as BookingConfirmResponse;
}

export const getBookingDetail = async (bookingId: number) => {
  console.log('getBookingDetail bookingId->', bookingId);
  const res = await axios.get(`${prefix}/${bookingId}`);
  console.log('getBookingDetail res->', res);
  return res.data as BookingInfo;
}