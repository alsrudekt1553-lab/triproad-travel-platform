import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    deleteAnswer,
    deleteFaq,
    deleteOne,
    getOne,
    putAnswer,
} from "../../api/qnaApi";
import type { Qna } from "../../types/qna";

interface LoginUser {
    USER_ID: number;
    LOGIN_ID?: string;
    NICKNAME?: string;
    NAME?: string;
    ROLE?: number;
    RESULT?: string;
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

function ReadPage() {
    const { qnaId } = useParams();
    const navigate = useNavigate();

    const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
    const [qna, setQna] = useState<Qna | null>(null);
    const [answerContent, setAnswerContent] = useState("");

    useEffect(() => {
        const savedUser = localStorage.getItem("loginUser");

        if (savedUser) {
            try {
                setLoginUser(JSON.parse(savedUser));
            } catch (err) {
                console.error("loginUser 파싱 실패", err);
                localStorage.removeItem("loginUser");
            }
        }
    }, []);

    const loadQna = () => {
        if (!qnaId) return;

        getOne(qnaId)
            .then(data => {
                setQna(data);
                setAnswerContent(data.answerContent || "");
            })
            .catch(err => {
                console.error("QNA READ ERROR =>", err);

                if (err.response?.status === 401) {
                    alert("로그인이 필요합니다.");
                    navigate("/user01/login");
                    return;
                }

                alert(err.response?.data?.message || err.response?.data || "조회 실패 또는 접근 권한 없음");
                navigate("/qna/list");
            });
    };

    useEffect(() => {
        loadQna();
    }, [qnaId]);

    const handleDelete = () => {
        if (!qnaId || !qna) return;

        if (!loginUser) {
            alert("로그인이 필요합니다.");
            navigate("/user01/login");
            return;
        }

        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        const apiCall = qna.qnaType === 500 ? deleteFaq(qnaId) : deleteOne(qnaId);

        apiCall
            .then(() => {
                alert("삭제되었습니다.");
                navigate("/qna/list");
            })
            .catch(err => {
                console.error(err);
                alert(err.response?.data?.message || err.response?.data || "삭제 실패");
            });
    };

    const handleAnswerSave = () => {
        if (!qnaId) return;

        if (!loginUser) {
            alert("로그인이 필요합니다.");
            navigate("/user01/login");
            return;
        }

        if (!answerContent.trim()) {
            alert("답변 내용을 입력하세요.");
            return;
        }

        putAnswer(qnaId, { answerContent })
            .then(() => {
                alert("답변이 저장되었습니다.");
                loadQna();
            })
            .catch(err => {
                console.error(err);
                alert(err.response?.data?.message || err.response?.data || "답변 저장 실패");
            });
    };

    const handleAnswerDelete = () => {
        if (!qnaId) return;

        if (!loginUser) {
            alert("로그인이 필요합니다.");
            navigate("/user01/login");
            return;
        }

        if (!window.confirm("답변을 삭제하시겠습니까?")) return;

        deleteAnswer(qnaId)
            .then(() => {
                alert("답변이 삭제되었습니다.");
                setAnswerContent("");
                loadQna();
            })
            .catch(err => {
                console.error(err);
                alert(err.response?.data?.message || err.response?.data || "답변 삭제 실패");
            });
    };

    if (!qna) {
        return (
            <div className="bg-white rounded-2xl p-8 m-2 w-full shadow-sm border border-gray-200">
                로딩중...
            </div>
        );
    }

    const isAdmin = loginUser?.ROLE === 900;
    const isOwner = qna.userId === loginUser?.USER_ID;
    const isFaq = qna.qnaType === 500;
    const canModify = isFaq ? isAdmin : isOwner && qna.qnaStatus !== 200;

    return (
        <div className="w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-6 text-white shadow">
                <p className="text-sm opacity-90 mb-2">Customer Center</p>
                <h2 className="text-3xl font-bold mb-2">QnA 상세조회</h2>
                <p className="text-sm opacity-90">
                    문의 상세 내용과 답변 상태를 확인할 수 있습니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-start gap-4 flex-wrap border-b pb-5 mb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                                {getQnaTypeName(qna.qnaType)}
                            </span>

                            <span
                                className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${getStatusClass(
                                    qna.qnaStatus
                                )}`}
                            >
                                {getQnaStatusName(qna.qnaStatus)}
                            </span>

                            {qna.isSecret === 1 && (
                                <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-semibold">
                                    🔒 비밀글
                                </span>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900">
                            {qna.title}
                        </h3>
                    </div>

                    <div className="text-sm text-gray-500 text-right">
                        <div>문의번호 #{qna.qnaId}</div>
                        <div>작성자 {qna.userId}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">작성일</p>
                        <p className="font-semibold text-gray-800">
                            {qna.createdAt?.substring(0, 10)}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">수정일</p>
                        <p className="font-semibold text-gray-800">
                            {qna.updatedAt ? qna.updatedAt.substring(0, 10) : "-"}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">공개 여부</p>
                        <p className="font-semibold text-gray-800">
                            {qna.isSecret === 1 ? "비밀글" : "공개"}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 min-h-[180px] whitespace-pre-wrap leading-7 text-gray-800">
                    {qna.content}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">관리자 답변</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            답변 등록 시 문의 상태가 답변완료로 변경됩니다.
                        </p>
                    </div>

                    {qna.answeredAt && (
                        <span className="text-sm text-gray-500">
                            답변일 {qna.answeredAt.substring(0, 10)}
                        </span>
                    )}
                </div>

                {qna.answerContent ? (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-5 whitespace-pre-wrap leading-7 text-gray-800 mb-4">
                        {qna.answerContent}
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-gray-500 mb-4">
                        아직 등록된 답변이 없습니다.
                    </div>
                )}

                {isAdmin && !isFaq && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                        <h4 className="font-bold text-gray-800 mb-3">
                            관리자 답변 관리
                        </h4>

                        <textarea
                            className="border border-gray-300 w-full p-3 h-32 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={answerContent}
                            onChange={e => setAnswerContent(e.target.value)}
                            placeholder="답변 내용을 입력하세요"
                        />

                        <div className="flex gap-2 mt-3">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
                                onClick={handleAnswerSave}
                            >
                                답변 등록/수정
                            </button>

                            {qna.answerContent && (
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold"
                                    onClick={handleAnswerDelete}
                                >
                                    답변 삭제
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex gap-2 justify-between flex-wrap">
                <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold"
                    onClick={() => navigate("/qna/list")}
                >
                    목록
                </button>

                <div className="flex gap-2">
                    {canModify && (
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-semibold"
                            onClick={() => navigate(`/qna/modify/${qna.qnaId}`)}
                        >
                            수정
                        </button>
                    )}

                    {(isOwner || isAdmin) && (
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold"
                            onClick={handleDelete}
                        >
                            삭제
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReadPage;