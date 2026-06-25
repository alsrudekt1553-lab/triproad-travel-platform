import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"
import type { QnaAdd, QnaModify, QnaAnswer, PageParam } from "../types/qna";

const prefix = `${API_SERVER_HOST}/api/qna`;
axios.defaults.withCredentials = true;

// 목록
export const getList = async (pageParam: PageParam) => {
    const { page, size } = pageParam;

    const res = await axios.get(`${prefix}/list`, {
        params: { page, size },
        withCredentials: true,
    });

    return res.data;
};

// 유형별 목록
export const getListByType = async (
    qnaType: number | string,
    pageParam: PageParam
) => {
    const { page, size } = pageParam;

    const res = await axios.get(`${prefix}/type/${qnaType}`, {
        params: { page, size },
        withCredentials: true,
    });

    return res.data;
};

// 로그인 유저별 목록
export const getListByUser = async (pageParam: PageParam) => {
    const { page, size } = pageParam;

    const res = await axios.get(`${prefix}/user`, {
        params: { page, size },
        withCredentials: true,
    });

    return res.data;
};

// 상세
export const getOne = async (qnaId: number | string) => {
    const res = await axios.get(`${prefix}/${qnaId}`, {
        withCredentials: true,
    });

    return res.data;
};

// 등록
export const postAdd = async (qnaObj: QnaAdd) => {
    const res = await axios.post(`${prefix}`, qnaObj, {
        withCredentials: true,
    });

    return res.data;
};

// 수정
export const putOne = async (qnaObj: QnaModify) => {
    const res = await axios.put(`${prefix}/${qnaObj.qnaId}`, qnaObj, {
        withCredentials: true,
    });

    return res.data;
};

// 삭제
export const deleteOne = async (qnaId: number | string) => {
    const res = await axios.delete(`${prefix}/${qnaId}`, {
        withCredentials: true,
    });

    return res.data;
};

// 답변 등록/수정
export const putAnswer = async (
    qnaId: number | string,
    answerObj: QnaAnswer
) => {
    const res = await axios.put(`${prefix}/${qnaId}/answer`, answerObj, {
        withCredentials: true,
    });

    return res.data;
};

// 답변 삭제
export const deleteAnswer = async (qnaId: number | string) => {
    const res = await axios.delete(`${prefix}/${qnaId}/answer`, {
        withCredentials: true,
    });

    return res.data;
};

// FAQ 등록
export const postFaq = async (qnaObj: QnaAdd) => {
    const res = await axios.post(`${prefix}/faq`, qnaObj, {
        withCredentials: true,
    });

    return res.data;
};

// FAQ 목록
export const getFaqList = async () => {
    const res = await axios.get(`${prefix}/faq`, {
        withCredentials: true,
    });

    return res.data;
};

// FAQ 수정
export const putFaq = async (qnaObj: QnaModify) => {
    const res = await axios.put(`${prefix}/faq/${qnaObj.qnaId}`, qnaObj, {
        withCredentials: true,
    });

    return res.data;
};

// FAQ 삭제
export const deleteFaq = async (qnaId: number | string) => {
    const res = await axios.delete(`${prefix}/faq/${qnaId}`, {
        withCredentials: true,
    });

    return res.data;
};