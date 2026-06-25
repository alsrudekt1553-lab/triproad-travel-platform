import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { getBookingDetail, deleteRelease } from "../../api/bookingApi";
import { getAgreementsByBooking, withdrawAgreement } from "../../api/agreementApi";
import { getCurrentUserId } from "../../api/sessionHelper";

interface DetailComponentProps {
  bookingId: number;
}

const extractFriendlyMessage = (err: unknown, defaultMsg: string): string => {
  console.error("[Booking Detail] 에러 상세:", err);
  if (!axios.isAxiosError(err) || !err.response?.data) return defaultMsg;
  const data = err.response.data;
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0 && message.length < 200) return message;
  }
  if (typeof data === "string" && data.length > 0 && data.length < 200) return data;
  return defaultMsg;
};

const statusLabel = (status: number) => {
  if (status === 100) return "예약대기";
  if (status === 500) return "예약확정";
  if (status === 900) return "취소됨";
  return `상태 ${status}`;
};



const statusTextClass = (status: number) => {
  if (status === 500) return "text-black font-medium";
  if (status === 100) return "text-grey-8 font-medium";
  return "text-grey-5";
};


const agreementTypeLabel = (typeCode: number) => {
  if (typeCode === 100) return "공통내용";
  if (typeCode === 200) return "거래·결제";
  if (typeCode === 300) return "상품·일정";
  if (typeCode === 400) return "운영·사후";
  return `유형 ${typeCode}`;
};

const formatLocalDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
};

const formatLocalDateShort = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
};

const formatDateRange = (start: string | null, end: string | null) => {
  if (!start || !end) return "(일정 정보 없음)";
  const sd = new Date(start);
  const ed = new Date(end);
  if (sd.getFullYear() === ed.getFullYear()) return `${formatLocalDate(start)} ~ ${formatLocalDateShort(end)}`;
  return `${formatLocalDate(start)} ~ ${formatLocalDate(end)}`;
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

function DetailComponent({ bookingId }: DetailComponentProps) {
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const [booking, setBooking]       = useState<BookingInfo | null>(null);
  const [agreements, setAgreements] = useState<AgreementConsentResponse[]>([]);
  const [loading, setLoading]       = useState<boolean>(true);
  const [error, setError]           = useState<string | null>(null);

  const [selectedAgreement, setSelectedAgreement] = useState<AgreementConsentResponse | null>(null);
  const [withdrawing, setWithdrawing] = useState<boolean>(false);

  const loadDetail = () => {
    setLoading(true);
    setError(null);
    console.log('DetailComponent loadDetail bookingId->', bookingId);

    Promise.all([
      getBookingDetail(bookingId),
      getAgreementsByBooking(bookingId),
    ])
      .then(([bookingData, agreementsData]) => {
        console.log('DetailComponent booking ->', bookingData);
        console.log('DetailComponent agreements ->', agreementsData);
        setBooking(bookingData);
        setAgreements(agreementsData);
        setLoading(false);
      })
      .catch((err) => {
        const msg = extractFriendlyMessage(err, "예약 정보를 불러올 수 없습니다.");
        setError(msg);
        setLoading(false);
      });
  };

  useEffect(() => { loadDetail(); }, [bookingId]);

  useEffect(() => {
    if (!selectedAgreement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedAgreement(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAgreement]);

  const handleRelease = async () => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await deleteRelease(bookingId);
      alert("예약이 취소되었습니다.");
      loadDetail();
    } catch (err) {
      alert(extractFriendlyMessage(err, "예약 취소에 실패했습니다. 잠시 후 다시 시도해주세요."));
    }
  };

  const handleWithdrawAgreement = async (agreement: AgreementConsentResponse) => {
    if (agreement.isRequired === 1) return;
    if (!window.confirm("선택 약관 동의를 철회하시겠습니까?")) return;

    setWithdrawing(true);
    try {
      await withdrawAgreement(agreement.userAgreementId, userId);
      alert("약관 동의가 철회되었습니다.");
      setSelectedAgreement(null);
      loadDetail();
    } catch (err) {
      alert(extractFriendlyMessage(err, "약관 동의 철회에 실패했습니다. 잠시 후 다시 시도해주세요."));
    } finally {
      setWithdrawing(false);
    }
  };

  const handleBack = () => {
    navigate('/booking/list');
  };

  if (loading) {
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            예약 상세
          </div>
        </div>
        <div className="max-w-[520px] mx-auto px-6 py-8 text-[14px] text-grey-5">로딩 중...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            예약 상세
          </div>
        </div>
        <div className="max-w-[520px] mx-auto px-6 py-8">
          <div className="text-[14px] text-grey-5 mb-4">{error || "예약 정보를 찾을 수 없습니다."}</div>
          <button
            type="button"
            onClick={handleBack}
            style={{ borderRadius: 0 }}
            className="w-full py-3 border border-black text-[14px] font-semibold text-black tracking-tight-kr hover:bg-black hover:text-white transition-colors"
          >
            예약 내역으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = booking.status === 900;

  return (
    <div className="w-full font-sans tracking-tight-kr">

      <div className="bg-black text-white">
        <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
          예약 상세
        </div>
      </div>

      <div className="max-w-[520px] mx-auto">
        <div className="flex flex-col px-4 pt-10 pb-6 gap-6">

  
          <div
            className={`bg-white border border-grey-2
              ${isCancelled ? "opacity-[0.55]" : ""}`}
          >
            <div className="px-5 py-3 border-b border-grey-2 flex items-center justify-between text-[12px] text-grey-5 tracking-tight-kr">
              <span>
                <span>예약 </span>
                <span className="font-medium" style={{ fontFamily: "monospace" }}>{booking.bookingId}</span>
                <span className="inline-block w-[10px]" />
                <span>일정 </span>
                <span className="font-medium" style={{ fontFamily: "monospace" }}>{booking.scheduleId}</span>
              </span>
            </div>

            <div className="px-5 pt-4 pb-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className={`text-[16px] font-semibold leading-snug flex-1 min-w-0 ${isCancelled ? "text-grey-5" : "text-black"}`}>
                  {booking.productName}
                </div>
                <div className={`text-[12px] whitespace-nowrap tracking-tight-kr ${isCancelled ? "text-grey-7 font-medium px-1.5 py-0.5 bg-grey-2" : statusTextClass(booking.status)}`}>
                  {statusLabel(booking.status)}
                </div>
              </div>
              <div className={`text-[13px] tracking-tight-kr ${isCancelled ? "text-grey-5" : "text-grey-7"}`}>
                {formatDateRange(booking.startDate, booking.endDate)} · {booking.headcount}명
              </div>
            </div>

            <div className="px-5 py-3 border-t border-grey-2 flex justify-between text-[12px] tracking-tight-kr">
              <span className="text-grey-5">예약 일시</span>
              <span className="text-grey-8 tracking-tight-num">{formatDateTime(booking.holdAt)}</span>
            </div>
          </div>


          <div className="bg-white border border-grey-2">
            <div className="px-5 py-3 border-b border-grey-2 text-[13px] font-semibold text-black tracking-tight-kr">
              예약자 정보
            </div>
            <table className="w-full text-[13px]">
              <tbody>
                <tr>
                  <td className="px-5 py-2.5 text-grey-5 w-5/12">이름</td>
                  <td className="px-5 py-2.5 text-black font-medium text-right">{booking.reserverName || "-"}</td>
                </tr>
                <tr>
                  <td className="px-5 py-2.5 text-grey-5">연락처</td>
                  <td className="px-5 py-2.5 text-black text-right tracking-tight-num">{booking.reserverPhone || "-"}</td>
                </tr>
                <tr>
                  <td className="px-5 py-2.5 pb-4 text-grey-5">이메일</td>
                  <td className="px-5 py-2.5 pb-4 text-black text-right">{booking.reserverEmail || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>


          <div className="bg-white border border-grey-2">
            <div className="px-5 py-3 border-b border-grey-2 text-[13px] font-semibold text-black tracking-tight-kr">
              결제 내역
            </div>
            <table className="w-full text-[13px]">
              <tbody>
                <tr>
                  <td className="px-5 py-2.5 text-grey-5 w-5/12">예약 인원</td>
                  <td className="px-5 py-2.5 text-black text-right">{booking.headcount}명</td>
                </tr>
                <tr>
                  <td className="px-5 py-2.5 text-grey-5">총 금액</td>
                  <td className="px-5 py-2.5 text-black text-right tracking-tight-num">{booking.totalPrice.toLocaleString()}원</td>
                </tr>
                <tr style={{ opacity: 0.6 }}>
                  <td className="px-5 py-2.5 text-grey-5">할인</td>
                  <td className="px-5 py-2.5 text-grey-5 text-right tracking-tight-num">
                    {booking.discountAmount > 0 ? `-${booking.discountAmount.toLocaleString()}` : "0"}원
                  </td>
                </tr>
                <tr style={{ opacity: 0.6 }}>
                  <td className="px-5 py-2.5 pb-4 text-grey-5">적립금 사용</td>
                  <td className="px-5 py-2.5 pb-4 text-grey-5 text-right tracking-tight-num">
                    {booking.pointUsed > 0 ? `-${booking.pointUsed.toLocaleString()}` : "0"}P
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="px-5 py-4 border-t-2 border-black flex justify-between items-baseline">
              <span className="text-[13px] text-grey-7 font-medium tracking-tight-kr">최종 결제</span>
              <span className="text-[26px] font-bold text-black tracking-tight-num">{booking.finalPrice.toLocaleString()}원</span>
            </div>
          </div>

   
          <div className="bg-white border border-grey-2">
            <div className="px-5 py-3 border-b border-grey-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-black tracking-tight-kr">약관 동의 이력</span>
              <span className="text-[11px] text-grey-5 tracking-tight-kr">{agreements.length}건</span>
            </div>

            {agreements.length === 0 ? (
              <div className="px-5 py-6 text-[13px] text-grey-5 tracking-tight-kr">
                동의 이력이 없습니다.
              </div>
            ) : (
              <div className="flex flex-col">
                {agreements.map((a, idx) => (
                  <button
                    key={a.userAgreementId}
                    type="button"
                    onClick={() => setSelectedAgreement(a)}
                    className={`text-left px-5 py-3 hover:bg-grey-1 transition-colors ${idx < agreements.length - 1 ? "border-b border-grey-2" : ""}`}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] text-grey-7 font-medium px-1.5 py-0.5 bg-grey-1 tracking-tight-kr">
                            {agreementTypeLabel(a.typeCode)}
                          </span>
                          <span className="text-[10px] text-grey-5 tracking-tight-kr">
                            {a.isRequired === 1 ? "필수" : "선택"}
                          </span>
                          <span className="text-[10px] text-grey-5 tracking-tight-kr">v{a.version}</span>
                        </div>
                        <div className="text-[13px] text-black leading-snug">{a.title}</div>
                      </div>
                      <span className="text-[11px] text-grey-5 shrink-0 tracking-tight-kr">내용보기</span>
                    </div>
                    <div className="text-[11px] text-grey-5 tracking-tight-num mt-1">
                      {formatDateTime(a.agreedAt)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

    
          <div className="flex flex-col gap-3 mt-2">
            {booking.status === 100 && (
              <button
                type="button"
                onClick={handleRelease}
                style={{ borderRadius: 0 }}
                className="w-full py-3 border border-black text-[14px] font-semibold text-black tracking-tight-kr hover:bg-hc-red hover:border-hc-red hover:text-white transition-colors"
              >
                예약 취소
              </button>
            )}
            <button
              type="button"
              onClick={handleBack}
              style={{ borderRadius: 0 }}
              className="w-full py-3 border border-grey-3 text-[14px] font-medium text-grey-8 tracking-tight-kr hover:border-black hover:text-black transition-colors"
            >
              예약 내역으로 돌아가기
            </button>
          </div>

        </div>
      </div>


      {selectedAgreement && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4"
          onClick={() => setSelectedAgreement(null)}
        >
          <div
            className="w-full max-w-[480px] max-h-[82vh] bg-white border border-grey-2 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-grey-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                
                  <span className="text-[10px] text-white font-medium px-1.5 py-0.5 bg-black tracking-tight-kr">
                    {agreementTypeLabel(selectedAgreement.typeCode)}
                  </span>
                  <span className="text-[10px] text-grey-5 tracking-tight-kr">
                    {selectedAgreement.isRequired === 1 ? "필수" : "선택"}
                  </span>
                  <span className="text-[10px] text-grey-5 tracking-tight-kr">v{selectedAgreement.version}</span>
                </div>
                <div className="text-[15px] font-semibold text-black leading-snug tracking-tight-kr">
                  {selectedAgreement.title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgreement(null)}
                className="shrink-0 w-8 h-8 text-[22px] leading-none text-grey-8 hover:text-black"
                aria-label="약관 모달 닫기"
              >
                ×
              </button>
            </div>

          
            <div className="px-6 py-5 overflow-y-auto text-[14px] leading-7 text-grey-8 whitespace-pre-wrap tracking-tight-kr">
              {selectedAgreement.content}
            </div>

            <div className="px-6 py-5 border-t border-grey-2 flex flex-col gap-2">
              {selectedAgreement.isRequired === 0 && (
                <button
                  type="button"
                  onClick={() => handleWithdrawAgreement(selectedAgreement)}
                  disabled={withdrawing}
                  style={{ borderRadius: 0 }}
                  className="w-full py-3 border border-black text-[14px] font-semibold text-black tracking-tight-kr hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {withdrawing ? "철회 처리 중..." : "동의 철회"}
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedAgreement(null)}
                style={{ borderRadius: 0 }}
                className="w-full py-3 border border-grey-3 text-[14px] font-medium text-grey-8 tracking-tight-kr hover:border-black hover:text-black transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailComponent;