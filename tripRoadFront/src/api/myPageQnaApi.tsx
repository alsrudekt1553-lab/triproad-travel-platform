import axios from "axios";

const prefix = "/api/mypage/qna";

export type MyQna = {
  qnaId: number;
  userId: number;

  productId?: number | null;
  scheduleId?: number | null;
  paymentId?: number | null;

  qnaType?: number | null;
  title: string;
  content: string;

  answerContent?: string | null;

  qnaStatus: number;
  isSecret?: number | null;
  isAdminPost?: number | null;

  createdAt: string;
  answeredAt?: string | null;
  updatedAt?: string | null;
};

export type MyQnaPageResponse = {
  dtoList: MyQna[];
  pageNumList?: number[];
  pageRequestDTO?: {
    page: number;
    size: number;
  };
  prev?: boolean;
  next?: boolean;
  totalCount?: number;
  prevPage?: number;
  nextPage?: number;
  totalPage?: number;
  current?: number;
};

export const getMyQnas = async (
  userId: number,
  page: number = 1,
  size: number = 10
) => {
  const res = await axios.get(`${prefix}/user/${userId}`, {
    params: {
      page,
      size,
    },
  });

  return res.data as MyQnaPageResponse;
};