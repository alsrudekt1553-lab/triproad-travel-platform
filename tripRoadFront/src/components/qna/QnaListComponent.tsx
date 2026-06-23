import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    getFaqList,
    getList,
    getListByType,
    getListByUser,
} from "../../api/qnaApi";
import type { Qna } from "../../types/qna";

interface Props {
    page: number;
    size: number;
    mode?: string;
    type?: string;
}

const getQnaTypeName = (qnaType: number) => {
    switch (qnaType) {
        case 100:
            return "상품문의";
        case 200:
            return "예약문의";
        case 300:
            return "결제문의";
        case 400:
            return "취소/환불";
        case 500:
            return "FAQ";
        case 600:
            return "기타문의";
        default:
            return "기타";
    }
};

const getQnaStatusName = (qnaStatus: number) => {
    switch (qnaStatus) {
        case 100:
            return "답변대기";
        case 200:
            return "답변완료";
        case 900:
            return "삭제";
        default:
            return "확인중";
    }
};

const getStatusClass = (qnaStatus: number) => {
    switch (qnaStatus) {
        case 100:
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case 200:
            return "bg-green-100 text-green-700 border-green-200";
        case 900:
            return "bg-gray-100 text-gray-500 border-gray-200";
        default:
            return "bg-blue-100 text-blue-700 border-blue-200";
    }
};

function QnaListComponent({ page, size, mode = "all", type = "" }: Props) {
    const navigate = useNavigate();

    const [qnaList, setQnaList] = useState<Qna[]>([]);
    const [pageNumList, setPageNumList] = useState<number[]>([]);
    const [current, setCurrent] = useState(page);
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(false);

    useEffect(() => {
        const pageParam = { page, size };

        let apiCall;

        if (mode === "faq") {
            apiCall = getFaqList();
        } else if (mode === "my") {
            apiCall = getListByUser(pageParam);
        } else if (mode === "type" && type) {
            apiCall = getListByType(type, pageParam);
        } else {
            apiCall = getList(pageParam);
        }

        apiCall
            .then(data => {
                if (Array.isArray(data)) {
                    setQnaList(data || []);
                    setPageNumList([]);
                    setCurrent(1);
                    setPrev(false);
                    setNext(false);
                    return;
                }

                setQnaList(data.dtoList || []);
                setPageNumList(data.pageNumList || []);
                setCurrent(data.current || page);
                setPrev(data.prev || false);
                setNext(data.next || false);
            })
            .catch(err => {
                console.error("QNA LIST ERROR =>", err);

                if (err.response?.status === 401) {
                    alert("로그인이 필요합니다.");
                    navigate("/user01/login");
                    return;
                }

                alert("QnA 목록 조회 실패");
            });
    }, [page, size, mode, type, navigate]);

    const moveList = (targetMode: string, targetType: string = "") => {
        if (targetMode === "type") {
            navigate(`/qna/list?page=1&size=${size}&mode=type&type=${targetType}`);
        } else {
            navigate(`/qna/list?page=1&size=${size}&mode=${targetMode}`);
        }
    };

    const isActive = (targetMode: string, targetType: string = "") => {
        if (targetMode === "type") {
            return mode === "type" && type === targetType;
        }

        return mode === targetMode;
    };

    const tabClass = (targetMode: string, targetType: string = "") => {
        return isActive(targetMode, targetType)
            ? "px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm"
            : "px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200";
    };

    return (
        <div className="w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-6 text-white shadow">
                <p className="text-sm opacity-90 mb-2">Customer Center</p>
                <h2 className="text-3xl font-bold mb-2">QnA 게시판</h2>
                <p className="text-sm opacity-90">
                    여행 상품, 예약, 결제, 취소/환불 관련 문의를 남겨주세요.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
                <div className="flex justify-between items-center gap-4 flex-wrap mb-5">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">문의 목록</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            전체 문의와 FAQ를 한 곳에서 확인할 수 있습니다.
                        </p>
                    </div>

                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm"
                        onClick={() => navigate("/qna/add")}
                    >
                        문의 등록
                    </button>
                </div>

                <div className="flex gap-2 mb-5 flex-wrap">
                    <button className={tabClass("all")} onClick={() => moveList("all")}>
                        전체
                    </button>

                    <button className={tabClass("my")} onClick={() => moveList("my")}>
                        내 문의
                    </button>

                    <button className={tabClass("faq")} onClick={() => moveList("faq")}>
                        FAQ
                    </button>

                    <button
                        className={tabClass("type", "100")}
                        onClick={() => moveList("type", "100")}
                    >
                        상품문의
                    </button>

                    <button
                        className={tabClass("type", "200")}
                        onClick={() => moveList("type", "200")}
                    >
                        예약문의
                    </button>

                    <button
                        className={tabClass("type", "300")}
                        onClick={() => moveList("type", "300")}
                    >
                        결제문의
                    </button>

                    <button
                        className={tabClass("type", "400")}
                        onClick={() => moveList("type", "400")}
                    >
                        취소/환불
                    </button>

                    <button
                        className={tabClass("type", "600")}
                        onClick={() => moveList("type", "600")}
                    >
                        기타문의
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-center">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm">
                                <th className="p-3 w-20">번호</th>
                                <th className="p-3 w-28">유형</th>
                                <th className="p-3">제목</th>
                                <th className="p-3 w-28">작성자</th>
                                <th className="p-3 w-28">상태</th>
                                <th className="p-3 w-24">공개여부</th>
                                <th className="p-3 w-32">작성일</th>
                            </tr>
                        </thead>

                        <tbody>
                            {qnaList.length === 0 ? (
                                <tr>
                                    <td className="p-10 text-gray-500" colSpan={7}>
                                        등록된 문의가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                qnaList.map(qna => (
                                    <tr
                                        key={qna.qnaId}
                                        className="border-t border-gray-100 hover:bg-blue-50/40 transition"
                                    >
                                        <td className="p-3 text-gray-500">{qna.qnaId}</td>

                                        <td className="p-3">
                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                                                {getQnaTypeName(qna.qnaType)}
                                            </span>
                                        </td>

                                        <td className="p-3 text-left">
                                            <button
                                                className="text-gray-800 hover:text-blue-600 hover:underline font-medium"
                                                onClick={() =>
                                                    navigate(`/qna/read/${qna.qnaId}`)
                                                }
                                            >
                                                {qna.isSecret === 1 && (
                                                    <span className="mr-1">🔒</span>
                                                )}
                                                {qna.title}
                                            </button>
                                        </td>

                                        <td className="p-3 text-gray-600">{qna.userId}</td>

                                        <td className="p-3">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${getStatusClass(
                                                    qna.qnaStatus
                                                )}`}
                                            >
                                                {getQnaStatusName(qna.qnaStatus)}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            {qna.isSecret === 1 ? (
                                                <span className="text-xs font-semibold text-red-500">
                                                    비밀글
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-gray-500">
                                                    공개
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-3 text-gray-500">
                                            {qna.createdAt?.substring(0, 10)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {mode !== "faq" && (
                    <div className="flex justify-center gap-2 mt-6">
                        {prev && (
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                                onClick={() =>
                                    navigate(
                                        `/qna/list?page=${page - 1}&size=${size}&mode=${mode}&type=${type}`
                                    )
                                }
                            >
                                이전
                            </button>
                        )}

                        {pageNumList.map(num => (
                            <button
                                key={num}
                                className={
                                    num === current
                                        ? "px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                                        : "px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
                                onClick={() =>
                                    navigate(
                                        `/qna/list?page=${num}&size=${size}&mode=${mode}&type=${type}`
                                    )
                                }
                            >
                                {num}
                            </button>
                        ))}

                        {next && (
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                                onClick={() =>
                                    navigate(
                                        `/qna/list?page=${page + 1}&size=${size}&mode=${mode}&type=${type}`
                                    )
                                }
                            >
                                다음
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QnaListComponent;