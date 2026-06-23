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


