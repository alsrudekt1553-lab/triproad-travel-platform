export interface Qna {
    qnaId: number;
    userId: number;
    productId?: number | null;
    qnaType: number;
    title: string;
    content: string;
    isSecret?: number;
    secret?: string;
    qnaStatus: number;
    answerContent?: string | null;
    answeredAt?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    isAdminPost?: number;
}

export interface QnaAdd {
    productId?: number | null;
    qnaType: number;
    title: string;
    content: string;
    isSecret: number;
}

export interface QnaModify {
    qnaId: number;
    qnaType: number;
    title: string;
    content: string;
    isSecret: number;
}

export interface QnaAnswer {
    answerContent: string;
}

export interface PageParam {
    page: number;
    size: number;
}