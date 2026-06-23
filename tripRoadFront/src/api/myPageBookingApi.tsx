import axios from "axios";

const prefix = "/api/mypage/booking";

export type BookingInfo = {
    bookingId: number;
    userId: number;
    scheduleId: number;
    headcount: number;
    totalPrice: number;
    discountAmount: number;
    finalPrice: number;
    status: number;
    holdAt: string;
    createdAt: string;
    updatedAt: string;
    reserverName: string;
    reserverPhone: string;
    reserverEmail: string;
    pointUsed: number;
};

export type MyPageBookingSchedule = {
    scheduleId: number;
    productId: number;
    productName: string;
    unitPrice: number;
    startDate: string;
    endDate: string;
    maxHeadcount: number;
    remainingCount: number;
    imageName?: string | null;
};

export const getBookingsByUser = async (userId: number) => {
    const res = await axios.get(`${prefix}/user/${userId}`);
    return res.data as BookingInfo[];
};

export const getScheduleForBooking = async (scheduleId: number) => {
    const res = await axios.get(`${prefix}/schedule/${scheduleId}`);
    return res.data as MyPageBookingSchedule;
};