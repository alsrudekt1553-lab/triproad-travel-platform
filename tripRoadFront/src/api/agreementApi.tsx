import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/agreement`;

export const getCurrentAgreements = async (productId?: number, scheduleId?: number) => {
  console.log('getCurrentAgreements productId->', productId, 'scheduleId->', scheduleId);

  const params: Record<string, number> = {};
  if (productId  != null) params.productId  = productId;
  if (scheduleId != null) params.scheduleId = scheduleId;

  const res = await axios.get(`${prefix}/current`, { params });
  console.log('getCurrentAgreements res->', res);
  return res.data as AgreementInfo[];
}

export const getAgreementsByBooking = async (bookingId: number) => {
  console.log('getAgreementsByBooking bookingId->', bookingId);
  const res = await axios.get(`${prefix}/booking/${bookingId}`);
  console.log('getAgreementsByBooking res->', res);
  return res.data as AgreementConsentResponse[];
}

export const withdrawAgreement = async (userAgreementId: number, userId: number) => {
  console.log('withdrawAgreement userAgreementId->', userAgreementId, 'userId->', userId);

  const res = await axios.patch(`${prefix}/withdraw/${userAgreementId}`, null, {
    params: { userId },
  });

  console.log('withdrawAgreement res->', res);
  return res.data as string;
}