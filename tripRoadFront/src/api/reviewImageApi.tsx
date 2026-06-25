import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"
import type { ReviewImage } from "../types/reviewImage";

const prefix = `${API_SERVER_HOST}/api/reviewImage`;

axios.defaults.withCredentials = true;
// 리뷰 이미지 업로드
export const uploadReviewImages = async (
  reviewId: number | string,
  files: File[]
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await axios.post(`${prefix}/upload/${reviewId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return res.data;
};

// 리뷰별 이미지 목록
export const getReviewImages = async (
  reviewId: number | string
): Promise<ReviewImage[]> => {
  const res = await axios.get(`${prefix}/review/${reviewId}`, {
    withCredentials: true,
  });

  return res.data;
};

// 이미지 삭제
export const deleteReviewImage = async (reviewImageId: number | string) => {
  const res = await axios.delete(`${prefix}/${reviewImageId}`, {
    withCredentials: true,
  });

  return res.data;
};

// 이미지 출력 URL
export const getReviewImageUrl = (imageName: string) => {
  return `${prefix}/view/${imageName}`;
};