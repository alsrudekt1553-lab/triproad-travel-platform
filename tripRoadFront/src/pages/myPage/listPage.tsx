import { useEffect, useState } from "react";
import axios from "axios";
import BookingListPage from "./BookingListPage";
import CalendarPage from "./CalendarPage";
import ChecklistPage from "./ChecklistPage";
import WishlistPage from "./WishlistPage";
import ReviewPage from "./ReviewPage";
import ProfileEditPage from "./ProfileEditPage";
import MyQnaPage from "./MyQnaPage";

type UserInfo = {
    userId: number;
    loginId: string;
    name: string;
    nickname: string;
    email: string;
    phone: string;
    profileImage: string | null;
};

function ListPage() {

    const [activeMenu, setActiveMenu] = useState("booking");

    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const userId = sessionStorage.getItem("USER_ID");

        if (!userId) {
            alert("로그인 정보가 없습니다.");
            return;
        }

        axios
            .get(`http://localhost:8587/api/user/${userId}`)
            .then((res) => {
                console.log("회원정보:", res.data);

                setUser({
                    userId: res.data.userId ?? res.data.USER_ID,
                    loginId: res.data.loginId ?? res.data.LOGIN_ID,
                    name: res.data.name ?? res.data.NAME,
                    nickname: res.data.nickname ?? res.data.NICKNAME,
                    email: res.data.email ?? res.data.EMAIL,
                    phone: res.data.phone ?? res.data.PHONE,
                    profileImage: res.data.profileImage ?? res.data.PROFILE_IMAGE,
                });
            })
            .catch((err) => {
                console.log("회원정보 조회 실패:", err);
            });
    }, []);

    const upcomingTrip = {
        title: "제주 레저 패키지",
        startDate: "2026.07.12",
        endDate: "2026.07.14",
        dday: 12,
        status: "예약완료"
    };

    const recentBookings = [
        {
            bookingId: 1,
            title: "부산 야경 투어",
            date: "2026.05.12",
            status: "예약완료"
        },
        {
            bookingId: 2,
            title: "제주 액티비티",
            date: "2026.05.01",
            status: "여행완료"
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto bg-white border rounded-lg overflow-hidden">

            {/* 프로필 영역 */}
            <div className="flex items-center gap-6 p-6 border-b">

                <div className="w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center">
                    {user?.profileImage ? (
                        <img
                            src={`http://localhost:8587/api/user/view/${user.profileImage}`}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-center">프로필<br />이미지</span>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold">
                        {user?.nickname}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        오늘도 여행을 준비해볼까요?
                    </p>
                </div>

            </div>

            <div className="flex min-h-[600px]">

                {/* 왼쪽 메뉴 */}
                <aside className="w-56 border-r">

                    <div
                        className="p-5 border-b cursor-pointer hover:bg-blue-100"
                        onClick={() => setActiveMenu("booking")}
                    >
                        🏝 예약 내역
                    </div>

                    <div
                        className="p-5 border-b cursor-pointer hover:bg-blue-100"
                        onClick={() => setActiveMenu("calendar")}
                    >
                        🗓 여행 캘린더
                    </div>

                    <div
                        className="p-5 border-b cursor-pointer hover:bg-blue-100"
                        onClick={() => setActiveMenu("checklist")}
                    >
                        🧳 체크리스트
                    </div>

                    <div
                        className="p-5 border-b cursor-pointer hover:bg-blue-100"
                        onClick={() => setActiveMenu("wishlist")}
                    >
                        💗 찜 목록
                    </div>

                    <div
                        className="p-5 border-b cursor-pointer hover:bg-blue-100"
                        onClick={() => setActiveMenu("review")}
                    >
                        ⭐ 나의 후기
                    </div>

                    <button
                        onClick={() => setActiveMenu("qna")}
                        className="w-full border-b px-6 py-5 text-left hover:bg-gray-50"
                    >
                        💬 내 문의
                    </button>

                    <div
                        className="p-5 border-b cursor-pointer hover:bg-blue-100"
                        onClick={() => setActiveMenu("profile")}
                    >
                        ⚙ 회원정보 수정
                    </div>

                </aside>

                {/* 오른쪽 내용 */}
                <main className="flex-1 p-6 bg-gray-50">

                    {/* 마이페이지 메인 */}
                    {activeMenu === "main" && (
                        <>
                            <div className="grid grid-cols-2 gap-6 mb-6">

                                <section className="bg-white border rounded-lg p-5">
                                    <h2 className="text-xl font-bold mb-4">
                                        다가오는 여행
                                    </h2>

                                    <p className="font-bold text-lg">
                                        다음 여행까지 D-{upcomingTrip.dday}
                                    </p>

                                    <div className="mt-4 border rounded-lg p-4">
                                        <p className="font-bold">
                                            [{upcomingTrip.title}]
                                        </p>

                                        <p>
                                            {upcomingTrip.startDate}
                                            {" ~ "}
                                            {upcomingTrip.endDate}
                                        </p>

                                        <p className="mt-2 text-blue-600 font-bold">
                                            {upcomingTrip.status}
                                        </p>
                                    </div>
                                </section>

                                <section className="bg-white border rounded-lg p-5">
                                    <h2 className="text-xl font-bold mb-4">
                                        나의 여행 요약
                                    </h2>

                                    <div className="border rounded-lg p-4 mb-3">
                                        찜한 패키지 5개
                                    </div>

                                    <div className="border rounded-lg p-4">
                                        작성한 리뷰 3개
                                    </div>
                                </section>

                            </div>

                            <section className="bg-white border rounded-lg p-5">
                                <h2 className="text-xl font-bold mb-4">
                                    최근 예약 내역
                                </h2>

                                {recentBookings.map((booking) => (
                                    <div
                                        key={booking.bookingId}
                                        className="flex items-center border-b py-4"
                                    >
                                        <div className="w-20 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                                            사진
                                        </div>

                                        <div>
                                            <p className="font-bold">
                                                {booking.title}
                                            </p>

                                            <p className="text-gray-500">
                                                {booking.date}
                                            </p>
                                        </div>

                                        <div className="ml-auto text-blue-600 font-bold">
                                            {booking.status}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        </>
                    )}

                    {/* 예약 내역 */}
                    {activeMenu === "booking" && (
                        user ? <BookingListPage userId={user.userId} /> : <div>회원 정보를 불러오는 중입니다.</div>
                    )}

                    {activeMenu === "calendar" && (
                        user ? <CalendarPage userId={user.userId} /> : <div>회원 정보를 불러오는 중입니다.</div>
                    )}

                    {activeMenu === "checklist" && (
                        user ? <ChecklistPage userId={user.userId} /> : <div>회원 정보를 불러오는 중입니다.</div>
                    )}

                    {activeMenu === "wishlist" && (
                        user ? <WishlistPage userId={user.userId} /> : <div>회원 정보를 불러오는 중입니다.</div>
                    )}

                    {activeMenu === "review" && (
                        user ? <ReviewPage userId={user.userId} /> : <div>회원 정보를 불러오는 중입니다.</div>
                    )}

                    {activeMenu === "qna" && 
                    user && ( <MyQnaPage userId={user.userId} /> 
                    )}

                    {activeMenu === "profile" && (
                        user ? <ProfileEditPage user={user} /> : <div>회원 정보를 불러오는 중입니다.</div>
                    )}

                </main>

            </div>
        </div>
    );
}

export default ListPage;