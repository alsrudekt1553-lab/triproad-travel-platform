import axios from "axios";

const prefix = "/api/mypage/review";

export const getMyReviews = async (userId: number) => {
    const res = await axios.get(`${prefix}/my/${userId}`);
    return res.data;
};

export const deleteMyReview = async (
    reviewId: number,
    userId: number
) => {
    const res = await axios.delete(`${prefix}/${reviewId}/${userId}`);
    return res.data;
};

export const updateMyReview = async (
    reviewId: number,
    userId: number,
    data: {
        rating: number;
        content: string;
    }
) => {
    const res = await axios.put(`${prefix}/${reviewId}/${userId}`, data);
    return res.data;
};