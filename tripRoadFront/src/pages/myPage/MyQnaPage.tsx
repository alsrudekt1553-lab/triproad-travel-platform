import { useEffect, useState } from "react";
import { getMyQnas, type MyQna } from "../../api/myPageQnaApi";
import { formatDate } from "../../utils/dateFormat";

function getStatusText(status: number) {
  if (status === 200) return "답변완료";
  if (status === 900) return "삭제됨";
  return "답변대기";
}

function getStatusClass(status: number) {
  if (status === 200) return "text-blue-600";
  if (status === 900) return "text-gray-400";
  return "text-orange-500";
}

type MyQnaPageProps = {
  userId: number;
};

function MyQnaPage({ userId }: MyQnaPageProps) {
  const [qnas, setQnas] = useState<MyQna[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyQnas(userId, 1, 20)
      .then((data) => {
        setQnas(data.dtoList || []);
      })
      .catch((err) => {
        console.log("내 문의 조회 실패:", err);
        alert("내 문의를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const visibleQnas = qnas.slice(0, visibleCount);

  return (
    <div className="border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            내 문의
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            작성한 문의 {qnas.length}개
          </p>
        </div>
      </div>

      {loading ? (
        <div className="border rounded-lg p-10 text-center text-gray-500">
          문의 내역을 불러오는 중입니다.
        </div>
      ) : qnas.length === 0 ? (
        <div className="border rounded-lg p-10 text-center text-gray-500">
          작성한 문의가 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleQnas.map((qna) => {
            const isOpen = openId === qna.qnaId;

            return (
              <div
                key={qna.qnaId}
                className="border rounded-lg p-5 hover:bg-gray-50"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg font-bold">
                        {qna.title}
                      </p>

                      {qna.isSecret === 1 && (
                        <span className="text-xs border rounded px-2 py-1">
                          비밀글
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      문의번호 {qna.qnaId}
                    </p>

                    <p
                      className={`font-bold mt-2 ${getStatusClass(
                        qna.qnaStatus
                      )}`}
                    >
                      {getStatusText(qna.qnaStatus)}
                    </p>

                    <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                      {qna.content}
                    </p>

                    <p className="text-sm text-gray-400 mt-3">
                      작성일: {formatDate(qna.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-start">
                    {qna.answerContent ? (
                      <button
                        onClick={() =>
                          setOpenId(isOpen ? null : qna.qnaId)
                        }
                        className="border rounded px-4 py-2 hover:bg-blue-50"
                      >
                        {isOpen ? "답변 닫기" : "답변 보기"}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400 mt-2">
                        답변 대기중
                      </span>
                    )}
                  </div>
                </div>

                {isOpen && qna.answerContent && (
                  <div className="mt-5 border-t pt-4 bg-blue-50 rounded p-4">
                    <p className="font-bold text-blue-700 mb-2">
                      관리자 답변
                    </p>

                    <p className="whitespace-pre-wrap text-gray-700">
                      {qna.answerContent}
                    </p>

                    {qna.answeredAt && (
                      <p className="text-sm text-gray-400 mt-3">
                        답변일: {qna.answeredAt}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {visibleCount < qnas.length && (
            <div className="text-center pt-2">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="border rounded px-5 py-2 hover:bg-gray-100"
              >
                더보기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyQnaPage;