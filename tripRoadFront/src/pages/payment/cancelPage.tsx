import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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

// 결제 취소 페이지
// 사용자가 카카오페이 결제창에서 "취소" 버튼을 눌렀을 때 진입
// URL: /payment/cancel/{bookingId}
// readyComponent의 cancelUrl과 매칭
//
// 처리 흐름:
//   1. sessionStorage에서 ready 데이터 꺼내기 (화면 표시용)
//   2. 백 cancel API 호출 → PAYMENT 삭제 + BOOKING 해제 (잔여 인원 즉시 회복)
//   3. sessionStorage 정리
//
// 백 호출 실패해도 사용자 에러 노출 X
// → BookingScheduler가 10분 내 자동 정리하는 안전망 작동
function CancelPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // ready 시점에 저장한 데이터 (sessionStorage에서 꺼냄, 화면 표시용)
  // 새로고침/직접 URL 진입 시 없을 수 있음 — 에러 아니라 정상 케이스
  const [storedData, setStoredData] = useState<ReadyStoredData | null>(null);

  // 결제 취소 처리 - PAYMENT 삭제 + BOOKING 해제 (잔여 인원 즉시 회복)
  // 멱등 보장: 백에서 ifPresent 처리 → 새로고침/중복 호출도 안전
  // StrictMode 중복 호출은 isPending/isSuccess로 차단
  // 실패해도 사용자에게 에러 노출 X — 스케줄러가 10분 후 자동 정리 (안전망)
  const cancelMutation = useMutation({
    mutationFn: (bid: number) => deleteCancel(bid),
    onSuccess: (res) => {
      console.log("CancelPage cancel res->", res);
    },
    onError: (err) => {
      // 사용자에게 에러 표시 X — 스케줄러 안전망 작동
      console.error("결제 취소 처리 실패 (스케줄러가 10분 내 자동 정리)", err);
    },
  });

  useEffect(() => {
    if (!bookingId) return;

    // sessionStorage에서 ready 데이터 꺼내기 (화면 표시용)
    const stored = sessionStorage.getItem(`payment_${bookingId}`);
    if (stored) {
      const data = JSON.parse(stored) as ReadyStoredData;
      setStoredData(data);
    }

    // 사용 완료된 sessionStorage 데이터 정리
    sessionStorage.removeItem(`payment_${bookingId}`);

    // 백 cancel API 호출 — PAYMENT 삭제 + BOOKING 해제
    if (cancelMutation.isPending || cancelMutation.isSuccess) return;
    cancelMutation.mutate(parseInt(bookingId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  return (
    <div className="bg-white rounded-lg p-4 m-2 w-full">
      <div className="border-2 border-blue-100 mt-10 mr-2 ml-2 p-6">
        <div className="text-2xl font-bold text-orange-500 mb-6">
          결제가 취소되었습니다
        </div>

        <div className="border-t border-b py-4 mb-6">
          {storedData && (
            <>
              <div className="text-lg mb-3 text-gray-700 font-bold">
                {storedData.productName}
              </div>
              <div className="flex justify-between text-lg mb-3">
                <div className="text-gray-500">결제 예정 금액</div>
                <div className="font-extrabold">
                  {storedData.amount.toLocaleString()}원
                </div>
              </div>
            </>
          )}
          <div className="flex justify-between text-sm text-gray-500">
            <div>예약 번호</div>
            <div>#{bookingId}</div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          예약은 일정 시간 동안 유지되며, 마이페이지에서 다시 결제하거나 취소할 수 있습니다.
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/booking/list")}
            className="flex-1 py-3 border rounded text-lg"
          >
            예약 내역으로
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 py-3 bg-blue-500 text-white rounded text-lg"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelPage;