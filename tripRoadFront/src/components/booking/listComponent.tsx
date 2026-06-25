import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getBookingsByUser } from "../../api/bookingApi";
import { getCurrentUserId } from "../../api/sessionHelper";

type TabKey = 'upcoming' | 'past' | 'cancelled';

const tabLabels: Record<TabKey, string> = {
  upcoming:  '이용 예정',
  past:      '지난 이용',
  cancelled: '취소',
};

const tabEmptyMessage: Record<TabKey, string> = {
  upcoming:  '이용 예정인 여행이 없습니다.',
  past:      '지난 이용 내역이 없습니다.',
  cancelled: '취소된 예약이 없습니다.',
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

const paymentMethodLabel = (method: number) => {
  if (method === 100) return "카카오페이";
  return "";
};


const formatApprovedAtShort = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
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

const classifyBooking = (booking: BookingInfo, today: Date): TabKey => {
  if (booking.status === 900) return 'cancelled';
  if (!booking.startDate) return 'upcoming';
  const start = new Date(booking.startDate);
  start.setHours(0, 0, 0, 0);
  return start >= today ? 'upcoming' : 'past';
};

function ListComponent() {
  const userId = getCurrentUserId();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [loading,  setLoading]  = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<TabKey>('upcoming');

  const loadBookings = () => {
    setLoading(true);
    getBookingsByUser(userId)
      .then((data) => { setBookings(data); setLoading(false); })
      .catch((err) => { console.error("예약 내역 조회 실패", err); setLoading(false); });
  };

  useEffect(() => { loadBookings(); }, [userId]);

  const handleCardClick = (bookingId: number) => {
    navigate(`/booking/detail/${bookingId}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filteredBookings = bookings.filter(b => classifyBooking(b, today) === selectedTab);

  const renderTabBar = () => (
    <div className="bg-white flex">
      {(['upcoming', 'past', 'cancelled'] as TabKey[]).map((tab) => {
        const isActive = selectedTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`
              flex-1 py-3 text-[14px] tracking-tight-kr transition-colors
              ${isActive
                ? 'text-black font-semibold border-b-[3px] border-black'
                : 'text-grey-5 border-b-2 border-transparent'}
            `}
          >
            {tabLabels[tab]}
          </button>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            예약 내역
          </div>
        </div>
        {renderTabBar()}
        <div className="max-w-[480px] mx-auto px-6 py-8 text-[14px] text-grey-5">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans tracking-tight-kr">
      <div className="bg-black text-white">
        <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
          예약 내역
        </div>
      </div>

      {renderTabBar()}

      <div className="max-w-[480px] mx-auto">
        <div className="flex flex-col px-4 pt-10 pb-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-grey-5 text-[14px] tracking-tight-kr">
              {tabEmptyMessage[selectedTab]}
            </div>
          ) : (
            filteredBookings.map((b) => {
              const isCancelled = b.status === 900;
              const hasPayment  = b.paymentMethod === 100 && b.payStatus === 500;
              return (
                <div
                  key={b.bookingId}
                  onClick={() => handleCardClick(b.bookingId)}
                  className={`mb-8 cursor-pointer transition-colors bg-white border border-grey-2
                    ${isCancelled ? "opacity-[0.55]" : "hover:border-grey-5"}`}
                >
                  <div className="px-5 py-3 border-b border-grey-2 flex items-center justify-between gap-2 tracking-tight-kr">
                    <span className="text-[12px] text-grey-5">
                      <span>예약 </span>
                      <span className="font-medium" style={{ fontFamily: "monospace" }}>{b.bookingId}</span>
                      <span className="inline-block w-[10px]" />
                      <span>일정 </span>
                      <span className="font-medium" style={{ fontFamily: "monospace" }}>{b.scheduleId}</span>
                    </span>
                    <span className={`text-[18px] leading-none ${isCancelled ? "text-grey-5" : "text-grey-7"}`} aria-hidden="true">›</span>
                  </div>

                  <div className="px-5 pt-4 pb-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className={`text-[16px] font-semibold leading-snug flex-1 min-w-0 ${isCancelled ? "text-grey-5" : "text-black"}`}>
                        {b.productName}
                      </div>
                      <div className={`text-[12px] whitespace-nowrap tracking-tight-kr ${isCancelled ? "text-grey-7 font-medium px-1.5 py-0.5 bg-grey-2" : statusTextClass(b.status)}`}>
                        {statusLabel(b.status)}
                      </div>
                    </div>
                    <div className={`text-[13px] tracking-tight-kr ${isCancelled ? "text-grey-5" : "text-grey-7"}`}>
                      {formatDateRange(b.startDate, b.endDate)} · {b.headcount}명
                    </div>
                  </div>

                  <div className="px-5 py-3.5 border-t border-grey-2 flex justify-between items-baseline gap-2">
                    <span className="text-[12px] text-grey-5 tracking-tight-num" style={{ opacity: 0.7 }}>
                      {hasPayment && (
                        <>
                          {paymentMethodLabel(b.paymentMethod)}
                          {b.approvedAt && ` · ${formatApprovedAtShort(b.approvedAt)}`}
                          {" · "}
                        </>
                      )}
                      {b.totalPrice.toLocaleString()}원
                      {b.pointUsed > 0 && ` (−${b.pointUsed.toLocaleString()}P)`}
                    </span>
                    <span className={`text-[20px] tracking-tight-num whitespace-nowrap font-semibold ${isCancelled ? "text-grey-5" : "text-black"}`}>
                      {b.finalPrice.toLocaleString()}원
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ListComponent;