import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { postApprove } from "../../api/paymentApi";

interface ReadyStoredData {
  tid: string;
  partnerOrderId: number;
  userId: number;
  bookingId: number;
  amount: number;
  productName: string;
}

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

const extractFriendlyMessage = (err: unknown, defaultMsg: string): string => {
  console.error("[Payment] approve 에러 상세:", err);

  if (!axios.isAxiosError(err) || !err.response?.data) {
    return defaultMsg;
  }

  const data = err.response.data;

  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0 && message.length < 200) {
      return message;
    }
  }

  if (typeof data === "string" && data.length > 0 && data.length < 200) {
    return data;
  }

  return defaultMsg;
};

function SuccessPage() {
  const { bookingId }    = useParams();
  const [searchParams]   = useSearchParams();
  const navigate         = useNavigate();
  const pgToken          = searchParams.get("pg_token");

  const [storedData,    setStoredData]    = useState<ReadyStoredData | null>(null);
  const [approveResult, setApproveResult] = useState<PaymentApproveResponse | null>(null);
  const [errorMsg,      setErrorMsg]      = useState<string>("");

  const approveMutation = useMutation({
    mutationFn: (req: PaymentApproveRequest) => postApprove(req),
    onSuccess: (res) => {
      console.log("SuccessPage approve res->", res);
      setApproveResult(res);
      if (bookingId) sessionStorage.removeItem(`payment_${bookingId}`);
    },
    onError: (err) => {
      const msg = extractFriendlyMessage(
        err,
        "결제 승인에 실패했습니다. 예약 내역에서 결제 상태를 확인해주시거나 고객센터로 문의해주세요."
      );
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
  }, [bookingId, pgToken]);

  if (errorMsg) {
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            결제 완료
          </div>
        </div>

        <div className="max-w-[520px] mx-auto px-6 pt-10 pb-8">
          <div className="border border-grey-2 p-5 mb-6 bg-white">
            <div className="text-[16px] font-semibold text-black mb-2">
              결제 승인 실패
            </div>
            <div className="text-[14px] text-grey-8">{errorMsg}</div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/booking/list")}
              style={{ borderRadius: 0 }}
              className="flex-1 py-3.5 border border-grey-2 text-[14px] text-grey-8
                hover:border-black hover:text-black transition-colors"
            >
              예약 내역으로
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{ borderRadius: 0 }}
              className="flex-1 py-3.5 bg-black text-white text-[14px] font-semibold
                hover:bg-grey-8 transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!approveResult) {
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            결제 완료
          </div>
        </div>

        <div className="max-w-[520px] mx-auto px-6 pt-10 pb-8">
          <div className="text-[16px] font-semibold text-black mb-2">
            결제 처리 중...
          </div>
          <div className="text-[14px] text-grey-5">
            잠시만 기다려주세요. 결제를 승인하고 있습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans tracking-tight-kr">

      <div className="bg-black text-white">
        <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
          결제 완료
        </div>
      </div>

      <div className="max-w-[520px] mx-auto px-6 pt-10 pb-8">

        <div className="text-center mb-8">
          <svg
            className="mx-auto mb-3 text-black"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <p className="text-[18px] font-semibold text-black tracking-tight-kr mb-1">
            예약이 확정되었습니다.
          </p>
          <p className="text-[13px] text-grey-5 tracking-tight-kr leading-relaxed">
            예약 내역에서 자세히 확인할 수 있습니다.
          </p>
        </div>

        <div className="border border-grey-2 bg-white mb-8">

          {storedData && (
            <div className="px-6 pt-5 pb-4 border-b border-grey-1
              text-[16px] font-semibold text-black">
              {storedData.productName}
            </div>
          )}

          <div className="px-6 pt-5 pb-5 border-b-2 border-black">
            <div className="text-[12px] text-grey-5 mb-2">
              총 결제금액
            </div>
            <div className="text-[32px] font-bold text-black tracking-tight-num leading-none">
              {approveResult.amount.toLocaleString()}
              <span className="text-[16px] font-medium ml-0.5">원</span>
            </div>
          </div>

          <div className="px-6 pt-3 pb-1 text-[12px] font-medium text-grey-5">
            결제 정보
          </div>

          <table className="w-full text-[15px]">
            <tbody>
              <tr className="border-b border-grey-1">
                <td className="py-3 pl-6 text-grey-5">예약 번호</td>
                <td className="py-3 pr-6 text-grey-8 text-right tracking-tight-num">
                  #{approveResult.bookingId}
                </td>
              </tr>
              <tr className="border-b border-grey-1">
                <td className="py-3 pl-6 text-grey-5">결제 번호</td>
                <td className="py-3 pr-6 text-grey-8 text-right tracking-tight-num">
                  #{approveResult.paymentId}
                </td>
              </tr>
              <tr>
                <td className="py-3 pl-6 pb-5 text-grey-5">승인 일시</td>
                <td className="py-3 pr-6 pb-5 text-grey-8 text-right tracking-tight-num">
                  {formatDate(approveResult.approvedAt)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/booking/list")}
            style={{ borderRadius: 0 }}
            className="flex-1 py-3.5 border border-grey-2 text-[14px] text-grey-8
              hover:border-black hover:text-black transition-colors"
          >
            예약 내역으로
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{ borderRadius: 0 }}
            className="flex-1 py-3.5 bg-black text-white text-[14px] font-semibold
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