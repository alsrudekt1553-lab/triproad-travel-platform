import { useEffect, useState } from "react";
import {
    getBookingsByUser,
    getScheduleForBooking,
} from "../../api/myPageBookingApi";
import {
	formatDate as formatDisplayDate
} from "../../utils/dateFormat";

type CalendarPageProps = {
    userId: number;
};

type Booking = {
    bookingId: number;
    scheduleId: number;
    status: number;
};

type Schedule = {
    scheduleId: number;
    productName: string;
    startDate: string;
    endDate: string;
};

type Trip = {
    bookingId: number;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
};

function CalendarPage({ userId }: CalendarPageProps) {
    const today = new Date();

    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const bookings = await getBookingsByUser(userId);

                const convertedTrips = await Promise.all(
                    bookings.map(async (booking: Booking) => {
                        const schedule: Schedule = await getScheduleForBooking(
                            booking.scheduleId
                        );

                        return {
                            bookingId: booking.bookingId,
                            title: schedule.productName,
                            startDate: schedule.startDate,
                            endDate: schedule.endDate,
                            status:
                                booking.status === 500
                                    ? "예약완료"
                                    : booking.status === 900
                                        ? "예약취소"
                                        : "예약대기",
                        };
                    })
                );

                setTrips(convertedTrips);
            } catch (err) {
                console.log("캘린더 데이터 조회 실패:", err);
            }
        };

        fetchTrips();
    }, [userId]);

    const movePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(11);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const moveNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(0);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const monthlyTrips = trips.filter((trip) => {
        const monthStart = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
        )}-01`;

        const monthEnd = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
        )}-${String(daysInMonth).padStart(2, "0")}`;

        return trip.startDate <= monthEnd && trip.endDate >= monthStart;
    });

    const calendarDays = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const formatDate = (day: number) => {
        const month = String(currentMonth + 1).padStart(2, "0");
        const date = String(day).padStart(2, "0");

        return `${currentYear}-${month}-${date}`;
    };

    const getTripsByDay = (day: number) => {
        const currentDate = formatDate(day);

        return trips.filter(
            (trip) =>
                currentDate >= trip.startDate &&
                currentDate <= trip.endDate
        );
    };

    const getDday = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const now = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const diff = start.getTime() - now.getTime();
        const dday = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (now < start) return `D-${dday}`;
        if (now >= start && now <= end) return "여행중";
        return "여행완료";
    };

    const getTripBackground = (displayStatus: string) => {
        if (displayStatus.startsWith("D-")) return "bg-blue-50";
        if (displayStatus === "여행중") return "bg-green-50";
        if (displayStatus === "여행완료") return "bg-orange-50";
        return "bg-gray-50";
    };

    const getTripTagStyle = (displayStatus: string) => {
        if (displayStatus.startsWith("D-")) {
            return "bg-blue-200 text-blue-800";
        }

        if (displayStatus === "여행중") {
            return "bg-green-200 text-green-800";
        }

        if (displayStatus === "여행완료") {
            return "bg-orange-200 text-orange-800";
        }

        return "bg-gray-200 text-gray-700";
    };

    return (
        <div className="border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-center gap-6 mb-6">
                <button
                    onClick={movePrevMonth}
                    className="border rounded px-3 py-1 hover:bg-gray-100"
                >
                    ◀
                </button>

                <h2 className="text-xl font-extrabold text-neutral-900">
                    {currentYear}년 {currentMonth + 1}월
                </h2>

                <button
                    onClick={moveNextMonth}
                    className="border rounded px-3 py-1 hover:bg-gray-100"
                >
                    ▶
                </button>
            </div>

            <div className="grid grid-cols-7 text-center font-bold border-b pb-2 mb-2">
                <div>일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div>토</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                    const dayTrips = day ? getTripsByDay(day) : [];

                    const firstTripStatus =
                        dayTrips.length > 0
                            ? getDday(
                                  dayTrips[0].startDate,
                                  dayTrips[0].endDate
                              )
                            : "";

                    const isToday =
                        day &&
                        currentYear === today.getFullYear() &&
                        currentMonth === today.getMonth() &&
                        day === today.getDate();

                    return (
                        <div
                            key={index}
                            className={`
                                min-h-24 border rounded p-2
                                ${
                                    dayTrips.length > 0
                                        ? getTripBackground(firstTripStatus)
                                        : "bg-gray-50"
                                }
                                ${isToday ? "border-blue-500 border-2" : ""}
                            `}
                        >
                            {day && (
                                <>
                                    <p className="font-bold mb-1">
                                        {day}
                                        {isToday && (
                                            <span className="ml-1 text-xs text-blue-600">
                                                오늘
                                            </span>
                                        )}
                                    </p>

                                    {dayTrips.map((trip) => {
                                        const displayStatus = getDday(
                                            trip.startDate,
                                            trip.endDate
                                        );

                                        return (
                                            <div
                                                key={trip.bookingId}
                                                className={`
                                                    text-xs rounded px-1 py-1 mb-1 truncate
                                                    ${getTripTagStyle(
                                                        displayStatus
                                                    )}
                                                `}
                                            >
                                                {trip.title}
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <section className="mt-6">
                <h3 className="mb-3 text-lg font-extrabold text-neutral-900">
                    여행 일정
                </h3>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {monthlyTrips.map((trip) => {
                        const displayStatus = getDday(
                            trip.startDate,
                            trip.endDate
                        );

                        return (
                            <div
                                key={trip.bookingId}
                                className="border rounded p-4 flex items-center"
                            >
                                <div>
                                    <p className="font-bold">{trip.title}</p>
                                    <p className="text-gray-500">
                                        {formatDisplayDate(trip.startDate)} ~{" "}
                                        {formatDisplayDate(trip.endDate)}
                                    </p>
                                </div>

                                <div className="ml-auto">
                                    <span
                                        className={`px-3 py-1 rounded font-bold ${getTripTagStyle(
                                            displayStatus
                                        )}`}
                                    >
                                        {displayStatus}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default CalendarPage;