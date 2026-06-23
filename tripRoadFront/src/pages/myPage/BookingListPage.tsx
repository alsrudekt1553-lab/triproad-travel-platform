import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    getBookingsByUser,
    getScheduleForBooking,
} from "../../api/myPageBookingApi";

type BookingListPageProps = {
    userId: number;
};

type Booking = {
    bookingId: number;
    createdAt: string;
    discountAmount: number;
    finalPrice: number;
    headcount: number;
    holdAt: string;
    pointUsed: number;
    reserverEmail: string;
    reserverName: string;
    reserverPhone: string;
    scheduleId: number;
    status: number;
    totalPrice: number;
    updatedAt: string;
    userId: number;

    imageName?: string | null;

    productName?: string;
    startDate?: string;
    endDate?: string;
};

function BookingListPage({ userId }: BookingListPageProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        getBookingsByUser(userId)
            .then(async (data) => {
                const newBookings = await Promise.all(
                    data.map(async (booking: Booking) => {
                        const schedule = await getScheduleForBooking(
                            booking.scheduleId
                        );

                        return {
                            ...booking,
                            productName: schedule.productName,
                            startDate: schedule.startDate,
                            endDate: schedule.endDate,
                            imageName: schedule.imageName,
                        };
                    })
                );

                console.log("이미지 포함 예약내역:", newBookings);
                setBookings(newBookings);
            })
            .catch((err) => {
                console.log("예약내역 조회 실패:", err);
            });
    }, [userId]);

    const getStatusText = (status: number) => {
        if (status === 100) return "예약대기";
        if (status === 500) return "예약완료";
        if (status === 900) return "예약취소";
        return "상태확인";
    };

    const handleProductDetail = async (scheduleId: number) => {
        try {
            const scheduleRes = await getScheduleForBooking(scheduleId);

            const productId = scheduleRes.productId;

            navigate(`/product/read/${productId}`);
        } catch (err) {
            console.log("상품 상세 이동 실패:", err);
            alert("상품 정보를 불러오지 못했습니다.");
        }
    };

    const handleBookingInfo = async (booking: Booking) => {
        try {
            const schedule = await getScheduleForBooking(booking.scheduleId);

            setSelectedBooking({
                ...booking,
                productName: schedule.productName,
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                imageName: schedule.imageName,
            });
        } catch (err) {
            console.log("예약 정보 조회 실패:", err);
            alert("예약 정보를 불러오지 못했습니다.");
        }
    };

 
    return (
        <div className="bg-white border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">예약 내역</h2>

            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.bookingId}
                        className="flex items-center border rounded-lg p-4 hover:bg-gray-50"
                    >
                        <div className="w-28 h-20 bg-gray-200 rounded-lg flex items-center justify-center mr-5 overflow-hidden">
                            {booking.imageName ? (
                                <img
                                    src={`http://localhost:8587/api/products/view/${booking.imageName}`}
                                    alt="상품 이미지"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>사진</span>
                            )}
                        </div>

                        <div>
                            <p className="text-lg font-bold">
                                예약번호 {booking.bookingId}
                            </p>

                            <p className="text-gray-500 mt-1">
                                일정번호 {booking.scheduleId}
                            </p>

                            <p>인원: {booking.headcount}명</p>

                            <p className="font-bold">
                                결제금액: {booking.finalPrice.toLocaleString()}원
                            </p>

                            <p className="text-blue-600 font-bold mt-2">
                                {getStatusText(booking.status)}
                            </p>

                            <p>예약자: {booking.reserverName}</p>
                            <p>연락처: {booking.reserverPhone}</p>
                            <p>이메일: {booking.reserverEmail}</p>
                        </div>

                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={() => handleBookingInfo(booking)}
                                className="border rounded px-4 py-2 hover:bg-blue-50"
                            >
                                예약 정보
                            </button>

                            <button
                                onClick={() => handleProductDetail(booking.scheduleId)}
                                className="border rounded px-4 py-2 hover:bg-blue-50"
                            >   
                                상품 상세
                            </button>
                        </div>
                    </div>
                ))}
                        </div>

            {selectedBooking && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
                        <h3 className="text-xl font-bold mb-4">예약 정보</h3>

                        <div className="space-y-2">
                            <p>예약번호: {selectedBooking.bookingId}</p>
                            <p>상품명: {selectedBooking.productName}</p>
                            <p>
                                여행일: {selectedBooking.startDate} ~ {selectedBooking.endDate}
                            </p>
                            <p>예약자: {selectedBooking.reserverName}</p>
                            <p>연락처: {selectedBooking.reserverPhone}</p>
                            <p>이메일: {selectedBooking.reserverEmail}</p>
                            <p>인원: {selectedBooking.headcount}명</p>
                            <p>
                                결제금액: {selectedBooking.finalPrice.toLocaleString()}원
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="mt-5 border rounded px-4 py-2 hover:bg-gray-100"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingListPage;