import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { deleteCancel } from "../../api/paymentApi";

interface ReadyStoredData {
  tid: string;
  partnerOrderId: number;
  userId: number;
  bookingId: number;
  amount: number;
  productName: string;
}

function FailPage() {
  const { bookingId }  = useParams();
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const errorCode = searchParams.get("error_code");
  const errorMsg  = searchParams.get("error_msg");
  const [storedData, setStoredData] = useState<ReadyStoredData | null>(null);
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
  }, [bookingId]);

  return (
    <div className="w-full font-sans tracking-tight-kr">

      <div className="bg-black text-white">
        <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
          결제 실패
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-6 pt-10 pb-8">

        <p className="text-[13px] font-medium mb-8 tracking-tight-kr"
           style={{ color: "#ED1C24" }}>
          결제에 실패했습니다.
        </p>

        <div className="border border-grey-2 bg-white mb-8">

          {storedData && (
            <div className="px-5 pt-4 pb-3 border-b border-grey-1
              text-[16px] font-semibold text-black">
              {storedData.productName}
            </div>
          )}

          <table className="w-full text-[14px]">
            <tbody>
              {storedData && (
                <tr>
                  <td className="py-2 pl-5 text-grey-5">결제 예정 금액</td>
                  <td className="py-2 pr-5 text-grey-8 font-medium text-right
                    tracking-tight-num">
                    {storedData.amount.toLocaleString()}원
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-2 pl-5 pb-4 text-grey-5">예약 번호</td>
                <td className="py-2 pr-5 pb-4 text-grey-8 text-right tracking-tight-num">
                  #{bookingId}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[13px] text-grey-5 mb-8 tracking-tight-kr leading-relaxed">
          결제 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주시거나,
          문제가 계속되면 고객센터로 문의해주세요.
        </p>

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

export default FailPage;