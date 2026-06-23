import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { postApprove } from "../../api/paymentApi";

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

// 날짜 포맷 (YYYY-MM-DD HH:mm)
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  const hh   = String(d.getHours()).padStart(2, "0");
  const min  = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

// ============================================================
// 결제 성공 페이지
// 카카오 결제 완료 후 approvalUrl로 리다이렉트되어 진입
// URL: /payment/success/{bookingId}?pg_token=xxx
//
// 동작 로직 유지 — 디자인만 현대카드 톤으로 정리
//   - 검정 헤더 바 "결제 완료"
//   - 무채색만 (색 강조 X, 굵기 700로만 강조)
//   - successPage는 #ED1C24 사용 금지
// ============================================================
function SuccessPage() {
  const { bookingId }    = useParams();
  const [searchParams]   = useSearchParams();
  const navigate         = useNavigate();
  const pgToken          = searchParams.get("pg_token");

  const [storedData,    setStoredData]    = useState<ReadyStoredData | null>(null);
  const [approveResult, setApproveResult] = useState<PaymentApproveResponse | null>(null);
  const [errorMsg,      setErrorMsg]      = useState<string>("");

  // useMutation — POST /api/payment/approve
  // isPending/isSuccess 체크로 StrictMode 중복 호출 차단
  const approveMutation = useMutation({
    mutationFn: (req: PaymentApproveRequest) => postApprove(req),
    onSuccess: (res) => {
      console.log("SuccessPage approve res->", res);
      setApproveResult(res);
      if (bookingId) sessionStorage.removeItem(`payment_${bookingId}`);
    },
    onError: (err) => {
      let msg = "결제 승인에 실패했습니다. 고객센터로 문의해주세요.";
      if (axios.isAxiosError(err) && err.response?.data) {
        msg = typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data);
      }
      console.error("결제 승인 실패", err);
      setErrorMsg(msg);
    },
  });

  useEffect(() => {
    if (!bookingId || !pgToken) {
      setErrorMsg("결제 정보가 올바르지 않습니다.");
      return;
    }
    const stored = sessionStorage.getItem(`payment_${bookingId}`);
    if (!stored) {
      setErrorMsg("결제 세션이 만료되었습니다. 예약 내역에서 결제 상태를 확인해주세요.");
      return;
    }
    const data = JSON.parse(stored) as ReadyStoredData;
    setStoredData(data);

    if (approveMutation.isPending || approveMutation.isSuccess) return;

    const req: PaymentApproveRequest = {
      tid:            data.tid,
      pgToken,
      partnerOrderId: data.partnerOrderId,
      userId:         data.userId,
    };
    console.log("SuccessPage approve req->", req);
    approveMutation.mutate(req);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, pgToken]);

  // ── 에러 화면 ─────────────────────────────────────────────
  if (errorMsg) {
    return (
      <div className="max-w-[520px] mx-auto bg-white font-sans tracking-tight-kr">
        <div className="bg-black text-white px-6 py-5 text-[17px] font-semibold">
          결제 완료
        </div>
        <div className="px-6 py-8">
          <div className="border border-grey-2 p-5 mb-6">
            <div className="text-[15px] font-semibold text-black mb-2">
              결제 승인 실패
            </div>
            <div className="text-[14px] text-grey-8">{errorMsg}</div>
          </div>
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

  // ── 처리중 화면 ───────────────────────────────────────────
  if (!approveResult) {
    return (
      <div className="max-w-[520px] mx-auto bg-white font-sans tracking-tight-kr">
        <div className="bg-black text-white px-6 py-5 text-[17px] font-semibold">
          결제 완료
        </div>
        <div className="px-6 py-8">
          <div className="text-[15px] font-semibold text-black mb-2">
            결제 처리 중...
          </div>
          <div className="text-[13px] text-grey-5">
            잠시만 기다려주세요. 결제를 승인하고 있습니다.
          </div>
        </div>
      </div>
    );
  }

  // ── 성공 화면 ─────────────────────────────────────────────
  // 색 강조 없음 — 굵기 700 + 검정으로만 강조 (현대카드 톤)
  return (
    <div className="max-w-[520px] mx-auto bg-white font-sans tracking-tight-kr">

      {/* 검정 헤더 바 */}
      <div className="bg-black text-white px-6 py-5 text-[17px] font-semibold">
        결제 완료
      </div>

      <div className="px-6 pb-8">

        {/* 결제 정보 카드 */}
        <div className="border border-grey-2 mt-6 mb-6">

          {/* 상품명 */}
          {storedData && (
            <div className="px-5 pt-4 pb-3 border-b border-grey-1
              text-[16px] font-semibold text-black">
              {storedData.productName}
            </div>
          )}

          {/* 결제 금액 강조 */}
          <div className="px-5 pt-4 pb-3 border-b border-grey-1
            flex justify-between items-baseline">
            <span className="text-[14px] text-grey-5">결제 금액</span>
            <span className="text-[26px] font-bold text-black tracking-tight-num">
              {approveResult.amount.toLocaleString()}원
            </span>
          </div>

          {/* 상세 정보 */}
          <table className="w-full text-[13px] px-5">
            <tbody>
              <tr>
                <td className="py-1.5 pl-5 text-grey-5">예약 번호</td>
                <td className="py-1.5 pr-5 text-grey-8 text-right">
                  #{approveResult.bookingId}
                </td>
              </tr>
              <tr>
                <td className="py-1.5 pl-5 text-grey-5">결제 번호</td>
                <td className="py-1.5 pr-5 text-grey-8 text-right">
                  #{approveResult.paymentId}
                </td>
              </tr>
              <tr>
                <td className="py-1.5 pl-5 pb-4 text-grey-5">승인 일시</td>
                <td className="py-1.5 pr-5 pb-4 text-grey-8 text-right">
                  {formatDate(approveResult.approvedAt)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

export default SuccessPage;