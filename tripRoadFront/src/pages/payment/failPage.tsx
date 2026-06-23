import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { deleteCancel } from "../../api/paymentApi";

// readyComponent가 sessionStorage에 저장해둔 데이터 모양
// payment_{bookingId} 키로 JSON.stringify되어 들어있음
interface ReadyStoredData {
  tid: string;
  partnerOrderId: number;
  userId: number;
  bookingId: number;
  amount: number;
  productName: string;
}

// ============================================================
// 결제 실패 페이지
// 카카오페이 결제 처리 중 시스템적 실패 발생 시 진입
// URL: /payment/fail/{bookingId}?error_code=xxx&error_msg=yyy
//
// 동작 로직 유지 — 디자인만 현대카드 톤으로 정리
//   - 검정 헤더 바 + 본문에 "결제에 실패했습니다" #ED1C24 인라인 메시지
//     (failPage는 #ED1C24 1회 허용 — 5곳 한정 중 1번 항목)
//   - 본문 나머지는 무채색
//
// 백 호출 실패해도 사용자 에러 노출 X
// → BookingScheduler가 10분 내 자동 정리 (안전망)
// ============================================================
function FailPage() {
  const { bookingId }  = useParams();
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const errorCode = searchParams.get("error_code");
  const errorMsg  = searchParams.get("error_msg");

  const [storedData, setStoredData] = useState<ReadyStoredData | null>(null);

  // 결제 정리 처리 — PAYMENT 삭제 + BOOKING 해제 (잔여 인원 즉시 회복)
  // cancelPage와 동일한 정리 로직 (cancel API 재사용)
  // 실패해도 사용자에게 에러 노출 X — 스케줄러가 10분 후 자동 정리
  const cancelMutation = useMutation({
    mutationFn: (bid: number) => deleteCancel(bid),
    onSuccess: (res) => {
      console.log("FailPage cancel res->", res);
    },
    onError: (err) => {
      console.error("결제 정리 처리 실패 (스케줄러가 10분 내 자동 정리)", err);
    },
  });

  useEffect(() => {
    if (!bookingId) return;

    // 카카오가 붙여준 오류 정보 로깅 (디버깅용, 화면 노출 X)
    if (errorCode || errorMsg) {
      console.warn("FailPage 카카오 오류 정보 -> code:", errorCode, "msg:", errorMsg);
    }

    const stored = sessionStorage.getItem(`payment_${bookingId}`);
    if (stored) {
      const data = JSON.parse(stored) as ReadyStoredData;
      setStoredData(data);
    }

    sessionStorage.removeItem(`payment_${bookingId}`);

    if (cancelMutation.isPending || cancelMutation.isSuccess) return;
    cancelMutation.mutate(parseInt(bookingId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // ── 렌더링 ───────────────────────────────────────────────
  return (
    <div className="max-w-[520px] mx-auto bg-white font-sans tracking-tight-kr">

      {/* 검정 헤더 바 */}
      <div className="bg-black text-white px-6 py-5 text-[17px] font-semibold">
        결제 실패
      </div>

      <div className="px-6 pb-8">

        {/* 실패 메시지 — #ED1C24 1회 허용 (5곳 한정 중 1번 항목) */}
        <p className="text-[13px] font-medium mt-6 mb-4 tracking-tight-kr"
           style={{ color: "#ED1C24" }}>
          결제에 실패했습니다.
        </p>

        {/* 실패 정보 카드 */}
        <div className="border border-grey-2 mb-6">

          {/* 상품명 */}
          {storedData && (
            <div className="px-5 pt-4 pb-3 border-b border-grey-1
              text-[16px] font-semibold text-black">
              {storedData.productName}
            </div>
          )}

          <table className="w-full text-[13px]">
            <tbody>
              {storedData && (
                <tr>
                  <td className="py-1.5 pl-5 text-grey-5">결제 예정 금액</td>
                  <td className="py-1.5 pr-5 text-grey-8 font-medium text-right
                    tracking-tight-num">
                    {storedData.amount.toLocaleString()}원
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-1.5 pl-5 pb-4 text-grey-5">예약 번호</td>
                <td className="py-1.5 pr-5 pb-4 text-grey-8 text-right">
                  #{bookingId}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 안내 문구 */}
        <p className="text-[13px] text-grey-5 mb-6 tracking-tight-kr leading-relaxed">
          결제 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주시거나,
          문제가 계속되면 고객센터로 문의해주세요.
        </p>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/booking/list")}
            style={{ borderRadius: 0 }}
            className="flex-1 py-3 border border-grey-2 text-[14px] text-grey-8
              hover:border-black hover:text-black transition-colors"
          >
            예약 내역으로
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{ borderRadius: 0 }}
            className="flex-1 py-3 bg-black text-white text-[14px] font-semibold
              hover:bg-grey-8 transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default FailPage;