import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"
import type { ReviewAdd, ReviewModify } from "../types/review";

const prefix = `${API_SERVER_HOST}/api/review`;
const imagePrefix = `${API_SERVER_HOST}/api/reviewImage`;

axios.defaults.withCredentials = true;

// 전체 리뷰 목록
export const getReviewList = async () => {
  const res = await axios.get(`${prefix}/list`, {
    withCredentials: true,
  });

  return res.data;
};

// 일정별 리뷰 목록
export const getReviewsBySchedule = async (
  scheduleId: number | string,
  sort?: string
) => {
  const res = await axios.get(`${prefix}/schedule/${scheduleId}`, {
    params: { sort },
    withCredentials: true,
  });

  return res.data;
};

// 리뷰 상세
export const getReviewOne = async (reviewId: number | string) => {
  const res = await axios.get(`${prefix}/${reviewId}`, {
    withCredentials: true,
  });

  return res.data;
};

// 리뷰 등록
export const postReview = async (reviewObj: ReviewAdd) => {
  const res = await axios.post(`${prefix}`, reviewObj, {
    withCredentials: true,
  });

  return res.data;
};

// 리뷰 수정
export const putReview = async (reviewObj: ReviewModify) => {
  const res = await axios.put(`${prefix}/${reviewObj.reviewId}`, reviewObj, {
    withCredentials: true,
  });

  return res.data;
};

// 리뷰 삭제
export const deleteReview = async (reviewId: number | string) => {
  const res = await axios.delete(`${prefix}/${reviewId}`, {
    withCredentials: true,
  });

  return res.data;
};

// 일정별 리뷰 요약
export const getReviewSummary = async (scheduleId: number | string) => {
  const res = await axios.get(`${prefix}/summary/${scheduleId}`, {
    withCredentials: true,
  });

  return res.data;
};

// 리뷰 이미지 목록
export const getReviewImages = async (reviewId: number | string) => {
  const res = await axios.get(`${imagePrefix}/review/${reviewId}`, {
    withCredentials: true,
  });

  return res.data;
};

// 리뷰 이미지 업로드
export const postReviewImage = async (
  reviewId: number | string,
  files: File[]
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await axios.post(`${imagePrefix}/upload/${reviewId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return res.data;
};

// 리뷰 이미지 삭제
export const deleteReviewImage = async (reviewImageId: number | string) => {
  const res = await axios.delete(`${imagePrefix}/${reviewImageId}`, {
    withCredentials: true,
  });

  return res.data;
};

// 이미지 실제 출력 URL
export const getReviewImageUrl = (imageName: string) => {
  return `${imagePrefix}/view/${imageName}`;
};