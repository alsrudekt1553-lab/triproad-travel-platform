import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPaymentsByUser } from "../../api/paymentApi";
import { getCurrentUserId } from "../../api/sessionHelper";

const statusLabel = (status: number) => {
  if (status === 100) return "미승인";
  if (status === 500) return "결제완료";
  if (status === 900) return "취소됨";
  return `상태 ${status}`;
};

const statusBorderClass = (status: number) => {
  if (status === 500) return "border-l-[3px] border-l-black";
  if (status === 100) return "border-l-[3px] border-l-grey-5";
  return "border-l-[3px] border-l-grey-2";
};

const statusTextClass = (status: number) => {
  if (status === 500) return "text-black font-medium";
  if (status === 100) return "text-grey-8 font-medium";
  return "text-grey-5";
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const d    = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  const hh   = String(d.getHours()).padStart(2, "0");
  const min  = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

const shortTid = (tid: string) => {
  if (!tid) return "-";
  return tid.length > 12 ? `${tid.substring(0, 12)}...` : tid;
};

function ListComponent() {
  const userId   = getCurrentUserId();
  const navigate = useNavigate();

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

  const handleCardClick = (bookingId: number) => {
    navigate(`/booking/detail/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            결제 내역
          </div>
        </div>
        <div className="max-w-[520px] mx-auto px-6 py-8 text-[14px] text-grey-5">로딩 중...</div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            결제 내역
          </div>
        </div>
        <div className="max-w-[520px] mx-auto px-6 py-8 text-[14px] text-grey-5">결제 내역이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans tracking-tight-kr">
      <div className="bg-black text-white">
        <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
          결제 내역
        </div>
      </div>

      <div className="max-w-[520px] mx-auto">
        <div className="flex flex-col px-4 pt-10 pb-4">
          {payments.map((p) => {
            const isCancelled = p.payStatus === 900;
            return (
              <div
                key={p.paymentId}
                onClick={() => handleCardClick(p.bookingId)}
                className={`mb-8 cursor-pointer transition-colors bg-white border border-grey-2
                  ${statusBorderClass(p.payStatus)}
                  ${isCancelled ? "opacity-[0.55]" : "hover:border-grey-5"}`}
              >
                <div className="px-5 py-3 border-b border-grey-2 flex items-center justify-between gap-2 tracking-tight-kr">
                  <span className="text-[12px] text-grey-5">
                    <span>결제 </span>
                    <span className="font-medium" style={{ fontFamily: "monospace" }}>{p.paymentId}</span>
                    <span className="inline-block w-[10px]" />
                    <span>예약 </span>
                    <span className="font-medium" style={{ fontFamily: "monospace" }}>{p.bookingId}</span>
                  </span>
                  <span className={`text-[18px] leading-none ${isCancelled ? "text-grey-5" : "text-grey-7"}`} aria-hidden="true">›</span>
                </div>

                <div className="px-5 pt-4 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className={`text-[16px] font-semibold leading-snug flex-1 min-w-0 ${isCancelled ? "text-grey-5" : "text-black"}`}>
                      카카오페이 결제
                    </div>
                    <div className={`text-[12px] whitespace-nowrap tracking-tight-kr ${isCancelled ? "text-grey-7 font-medium px-1.5 py-0.5 bg-grey-2" : statusTextClass(p.payStatus)}`}>
                      {statusLabel(p.payStatus)}
                    </div>
                  </div>
                  <div className={`text-[13px] tracking-tight-kr ${isCancelled ? "text-grey-5" : "text-grey-7"}`}>
                    {formatDateTime(p.approvedAt)}
                    {p.tid && <> · 거래 <span style={{ fontFamily: "monospace" }}>{shortTid(p.tid)}</span></>}
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-grey-2 flex justify-between items-baseline gap-2">
                  <span className="text-[12px] text-grey-5 tracking-tight-num" style={{ opacity: 0.7 }}>
                    결제 금액
                  </span>
                  <span className={`text-[20px] tracking-tight-num whitespace-nowrap font-semibold ${isCancelled ? "text-grey-5" : "text-black"}`}>
                    {p.amount.toLocaleString()}원
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListComponent;