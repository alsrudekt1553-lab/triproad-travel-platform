import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    getOne,
    putFaq,
    putOne,
} from "../../api/qnaApi";
import type { Qna, QnaModify } from "../../types/qna";

interface LoginUser {
    USER_ID: number;
    LOGIN_ID?: string;
    NICKNAME?: string;
    NAME?: string;
    ROLE?: number;
    RESULT?: string;
}

function ModifyPage() {
    const { qnaId } = useParams();
    const navigate = useNavigate();

    const [loginUser, setLoginUser] = useState<LoginUser | null>(null);

    const [qnaType, setQnaType] = useState(100);
    const [isSecret, setIsSecret] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const isFaq = qnaType === 500;
    const isAdmin = loginUser?.ROLE === 900;

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

    useEffect(() => {
        if (!qnaId) return;

        getOne(qnaId)
            .then((data: Qna) => {
                if (data.qnaStatus === 200 && data.qnaType !== 500) {
                    alert("답변 완료된 문의는 수정할 수 없습니다.");
                    navigate(`/qna/read/${qnaId}`);
                    return;
                }

                setQnaType(data.qnaType);
                setIsSecret(data.isSecret || 0);
                setTitle(data.title);
                setContent(data.content);
            })
            .catch(err => {
                console.error("QNA MODIFY READ ERROR =>", err);

                if (err.response?.status === 401) {
                    alert("로그인이 필요합니다.");
                    navigate("/user01/login");
                    return;
                }

                alert(err.response?.data?.message || err.response?.data || "수정 화면 조회 실패");
                navigate("/qna/list");
            });
    }, [qnaId, navigate]);

    const handleSubmit = () => {
        if (!qnaId) return;

        if (!loginUser) {
            alert("로그인이 필요합니다.");
            navigate("/user01/login");
            return;
        }

        if (isFaq && !isAdmin) {
            alert("FAQ는 관리자만 수정할 수 있습니다.");
            return;
        }

        if (!title.trim()) {
            alert("제목을 입력하세요.");
            return;
        }

        if (!content.trim()) {
            alert("내용을 입력하세요.");
            return;
        }

        const qnaObj: QnaModify = {
            qnaId: Number(qnaId),
            qnaType,
            title,
            content,
            isSecret: isFaq ? 0 : isSecret,
        };

        const apiCall = isFaq ? putFaq(qnaObj) : putOne(qnaObj);

        apiCall
            .then(() => {
                alert("수정되었습니다.");
                navigate(`/qna/read/${qnaId}`);
            })
            .catch(err => {
                console.error(err);

                if (err.response?.status === 401) {
                    alert("로그인이 필요합니다.");
                    navigate("/user01/login");
                    return;
                }

                alert(err.response?.data?.message || err.response?.data || "수정 실패");
            });
    };

    return (
        <div className="w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-6 text-white shadow">
                <p className="text-sm opacity-90 mb-2">Customer Center</p>
                <h2 className="text-3xl font-bold mb-2">문의 수정</h2>
                <p className="text-sm opacity-90">
                    등록한 문의 내용을 수정할 수 있습니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="border-b pb-5 mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        {isFaq ? "FAQ 수정" : "1:1 문의 수정"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        답변 완료된 문의는 수정할 수 없습니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="block mb-2 font-bold text-gray-700">
                            문의유형
                        </label>
                        <select
                            className="border border-gray-300 w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={qnaType}
                            onChange={e => setQnaType(Number(e.target.value))}
                        >
                            <option value={100}>상품문의</option>
                            <option value={200}>예약문의</option>
                            <option value={300}>결제문의</option>
                            <option value={400}>취소/환불</option>
                            {isAdmin && <option value={500}>FAQ</option>}
                            <option value={600}>기타문의</option>
                        </select>
                    </div>

                    {!isFaq && (
                        <div>
                            <label className="block mb-2 font-bold text-gray-700">
                                공개 여부
                            </label>
                            <select
                                className="border border-gray-300 w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={isSecret}
                                onChange={e => setIsSecret(Number(e.target.value))}
                            >
                                <option value={0}>공개</option>
                                <option value={1}>비밀글</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block mb-2 font-bold text-gray-700">
                        제목
                    </label>
                    <input
                        className="border border-gray-300 w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-bold text-gray-700">
                        내용
                    </label>
                    <textarea
                        className="border border-gray-300 w-full p-3 h-56 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </div>

                <div className="flex justify-between gap-2 flex-wrap">
                    <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold"
                        onClick={() => navigate("/qna/list")}
                    >
                        목록
                    </button>

                    <div className="flex gap-2">
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl font-semibold"
                            onClick={() => navigate(`/qna/read/${qnaId}`)}
                        >
                            취소
                        </button>

                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-semibold"
                            onClick={handleSubmit}
                        >
                            수정 완료
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModifyPage;