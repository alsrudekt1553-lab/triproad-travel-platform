import { useEffect, useState } from "react";
import { getPaymentsByUser } from "../../api/paymentApi";
import { getCurrentUserId } from "../../api/user01Api";

// PayStatus 코드 → 한글 라벨
// 백 PayStatus: READY(100), APPROVED(500), CANCELLED(900)
const statusLabel = (status: number) => {
  if (status === 100) return "미승인";
  if (status === 500) return "결제완료";
  if (status === 900) return "취소됨";
  return `상태 ${status}`;
};

// 날짜 포맷 (YYYY-MM-DD HH:mm)
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const d    = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  const hh   = String(d.getHours()).padStart(2, "0");
  const min  = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

// TID 부분 표시 (앞 12자리만)
// 카카오 거래번호는 30자 — 카드에 그대로 박으면 줄바꿈 발생 → 앞부분만 노출
const shortTid = (tid: string) => {
  if (!tid) return "-";
  return tid.length > 12 ? `${tid.substring(0, 12)}...` : tid;
};

// ============================================================
// 마이페이지 — 회원별 결제 내역 조회
// API: GET /api/payment/user/{userId}
// 백이 승인일 최신순으로 정렬해서 내려줌 (findByUserIdOrderByApprovedAtDesc)
//
// v2 자리:
//   - 환불 신청 버튼 (APPROVED 상태) → postRefund(bookingId) 호출
//     현재 미구현 — 백 POST /api/payment/refund/{bookingId} v1 구현 완료
//     마이페이지 환불 UI 도입 시 아래 주석 영역 활성화
// ============================================================
function ListComponent() {
  const userId = getCurrentUserId();

  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [loading,  setLoading]  = useState<boolean>(true);

  const loadPayments = () => {
    setLoading(true);
    console.log("Payment ListComponent loadPayments userId->", userId);
    getPaymentsByUser(userId)
      .then((data) => {
        console.log("Payment ListComponent getList Response:", data);
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("결제 내역 조회 실패", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPayments();
  }, [userId]);

  // ── 렌더링 ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-4 py-6 text-[14px] text-grey-5 font-sans tracking-tight-kr">
        로딩 중...
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="px-4 py-6 text-[14px] text-grey-5 font-sans tracking-tight-kr">
        결제 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="font-sans tracking-tight-kr">
      <div className="flex flex-col gap-3 p-4">
        {payments.map((p) => (
          <div
            key={p.paymentId}
            className="border border-grey-2 bg-white"
          >
            {/* 카드 헤더 */}
            <div className="px-5 pt-4 pb-3 border-b border-grey-1
              flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[16px] font-semibold text-black">
                  #{p.paymentId}
                </span>
                <span className="text-[13px] text-grey-5">
                  예약 {p.bookingId}
                </span>
              </div>

              {/* 상태 — 색 없이 굵기로만 구분 */}
              <span className={`text-[13px] tracking-tight-kr
                ${p.payStatus === 500 ? "font-semibold text-black" : ""}
                ${p.payStatus === 100 ? "font-medium text-grey-8" : ""}
                ${p.payStatus === 900 ? "font-normal text-grey-4" : ""}
              `}>
                {statusLabel(p.payStatus)}
              </span>
            </div>

            {/* 카드 바디 */}
            <div className="px-5 py-3">
              <table className="w-full text-[13px]">
                <tbody>
                  <tr>
                    <td className="py-1 text-grey-5 w-5/12">결제 금액</td>
                    <td className="py-1 text-black font-semibold text-right tracking-tight-num">
                      {p.amount.toLocaleString()}원
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-grey-5">승인 일시</td>
                    <td className="py-1 text-grey-8 text-right">
                      {formatDate(p.approvedAt)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 pb-3 text-grey-5">거래번호</td>
                    <td className="py-1 pb-3 text-grey-8 text-right">
                      {shortTid(p.tid)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ============================================================ */}
              {/* v2 자리 — 환불 신청 버튼                                      */}
              {/* 백 POST /api/payment/refund/{bookingId} v1 구현 완료          */}
              {/* 마이페이지 환불 UI 도입 시 아래 주석 해제                      */}
              {/*                                                               */}
              {/* {p.payStatus === 500 && (                                     */}
              {/*   <button                                                      */}
              {/*     type="button"                                              */}
              {/*     onClick={() => postRefund(p.bookingId)}                   */}
              {/*     style={{ borderRadius: 0 }}                               */}
              {/*     className="w-full mt-2 py-2.5 border border-black         */}
              {/*       text-[13px] font-semibold text-black tracking-tight-kr  */}
              {/*       hover:bg-hc-red hover:border-hc-red hover:text-white     */}
              {/*       transition-colors"                                       */}
              {/*   >                                                            */}
              {/*     환불 신청                                                   */}
              {/*   </button>                                                    */}
              {/* )}                                                             */}
              {/* ============================================================ */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListComponent;