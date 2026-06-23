import { useEffect, useState } from "react";
import { getBookingsByUser, deleteRelease } from "../../api/bookingApi";
import { getCurrentUserId } from "../../api/user01Api";

// 예약 상태 코드 → 한글 라벨
// 백 BookingStatus: HOLD(100), CONFIRMED(500), CANCELLED(900)
const statusLabel = (status: number) => {
  if (status === 100) return "예약대기";
  if (status === 500) return "예약완료";
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

// ============================================================
// 마이페이지 — 회원별 예약 내역 조회
// API: GET /api/booking/user/{userId}
//
// 취소된 예약(status=900)도 함께 노출
// HOLD(100) 상태에서만 취소 버튼 노출
// ============================================================
function ListComponent() {
  const userId = getCurrentUserId();

  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [loading,  setLoading]  = useState<boolean>(true);

  const loadBookings = () => {
    setLoading(true);
    console.log("Booking ListComponent loadBookings userId->", userId);
    getBookingsByUser(userId)
      .then((data) => {
        console.log("Booking ListComponent getList Response:", data);
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("예약 내역 조회 실패", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBookings();
  }, [userId]);

  // 선점 해제 (취소) — HOLD(100) 상태에서만 노출
  const handleRelease = async (bookingId: number) => {
    if (!window.confirm(`예약 #${bookingId}을(를) 취소하시겠습니까?`)) return;
    try {
      await deleteRelease(bookingId);
      alert("예약이 취소되었습니다.");
      loadBookings();
    } catch (err) {
      console.error("선점 해제 실패", err);
      alert("취소 처리에 실패했습니다.");
    }
  };

  // ── 렌더링 ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-4 py-6 text-[14px] text-grey-5 font-sans tracking-tight-kr">
        로딩 중...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="px-4 py-6 text-[14px] text-grey-5 font-sans tracking-tight-kr">
        예약 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="font-sans tracking-tight-kr">
      <div className="flex flex-col gap-3 p-4">
        {bookings.map((b) => (
          <div
            key={b.bookingId}
            className="border border-grey-2 bg-white"
          >
            {/* 카드 헤더 */}
            <div className="px-5 pt-4 pb-3 border-b border-grey-1
              flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[16px] font-semibold text-black">
                  #{b.bookingId}
                </span>
                <span className="text-[13px] text-grey-5">
                  일정 {b.scheduleId}
                </span>
              </div>

              {/* 상태 — 색 없이 굵기로만 구분 */}
              <span className={`text-[13px] tracking-tight-kr
                ${b.status === 500 ? "font-semibold text-black" : ""}
                ${b.status === 100 ? "font-medium text-grey-8" : ""}
                ${b.status === 900 ? "font-normal text-grey-4" : ""}
              `}>
                {statusLabel(b.status)}
              </span>
            </div>

            {/* 카드 바디 */}
            <div className="px-5 py-3">
              <table className="w-full text-[13px]">
                <tbody>
                  <tr>
                    <td className="py-1 text-grey-5 w-5/12">예약 인원</td>
                    <td className="py-1 text-grey-8 font-medium text-right">
                      {b.headcount}명
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-grey-5">할인</td>
                    <td className="py-1 text-grey-8 font-medium text-right tracking-tight-num">
                      {b.discountAmount.toLocaleString()}원
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-grey-5">최종 결제</td>
                    <td className="py-1 text-black font-semibold text-right tracking-tight-num">
                      {b.finalPrice.toLocaleString()}원
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-grey-5">예약 일시</td>
                    <td className="py-1 text-grey-8 text-right">
                      {formatDate(b.holdAt)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* HOLD(100) 상태만 취소 버튼 노출 */}
            {b.status === 100 && (
              <div className="px-5 pb-4">
                <button
                  type="button"
                  onClick={() => handleRelease(b.bookingId)}
                  style={{ borderRadius: 0 }}
                  className="w-full py-2.5 border border-black text-[13px]
                    font-semibold text-black tracking-tight-kr
                    hover:bg-hc-red hover:border-hc-red hover:text-white
                    transition-colors"
                >
                  예약 취소
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListComponent;