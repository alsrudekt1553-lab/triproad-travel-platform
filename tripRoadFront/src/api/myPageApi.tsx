import axios from "axios";

const host = "http://localhost:8587/api/mypage";
const userHost = "http://localhost:8587/api/user";

export const getWishlists = (userId: number) => {
    return axios.get(`${host}/${userId}/wishlist`);
};

export const deleteWishlist = (wishlistId: number) => {
    return axios.delete(`${host}/wishlist/${wishlistId}`);
};

export const getChecklists = (userId: number) => {
    return axios.get(`${host}/${userId}/checklists`);
};

export const getChecklistItems = (checklistId: number) => {
    return axios.get(`${host}/checklists/${checklistId}/items`);
};

export const addChecklist = (data: {
    userId: number;
    bookingId: number | null;
    title: string;
}) => {
    return axios.post(`${host}/checklists`, data);
};

export const updateChecklist = (
    checklistId: number,
    data: { title: string }
) => {
    return axios.put(`${host}/checklists/${checklistId}`, data);
};

export const deleteChecklist = (checklistId: number) => {
    return axios.delete(`${host}/checklists/${checklistId}`);
};

export const addChecklistItem = (data: {
    checklistId: number;
    itemName: string;
    isChecked: number;
}) => {
    return axios.post(`${host}/checklist-items`, data);
};

export const updateChecklistItem = (
    itemId: number,
    data: { itemName: string; isChecked: number }
) => {
    return axios.put(`${host}/checklist-items/${itemId}`, data);
};

export const deleteChecklistItem = (itemId: number) => {
    return axios.delete(`${host}/checklist-items/${itemId}`);
};

export const getBookingsByUserId = (userId: number) => {
    return axios.get(`${host}/user/${userId}`);
};

export const getScheduleForBooking = (scheduleId: number) => {
    return axios.get(`${host}/schedule/${scheduleId}`);
};

export const updateUser = async (
    userId: number,
    formData: FormData
) => {
    const res = await axios.put(
        `${userHost}/modify/${userId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};