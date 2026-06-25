import { useEffect, useState } from "react"
import axios from "axios"
import BookingListPage from "./BookingListPage"
import CalendarPage from "./CalendarPage"
import ChecklistPage from "./ChecklistPage"
import WishlistPage from "./WishlistPage"
import ReviewPage from "./ReviewPage"
import ProfileEditPage from "./ProfileEditPage"
import MyQnaPage from "./MyQnaPage"
import ChangePasswordPage from "./ChangePasswordPage";
import { API_SERVER_HOST } from "../../api/apiConfig"

type UserInfo = {
	userId: number
	loginId: string
	name: string
	nickname: string
	email: string
	phone: string
	profileImage: string | null
	createdAt?: string
}

function ListPage() {
	const [activeMenu, setActiveMenu] = useState("booking")
	const [user, setUser] = useState<UserInfo | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const userId = sessionStorage.getItem("USER_ID")

		if (!userId) {
			alert("로그인 정보가 없습니다.")
			setLoading(false)
			return
		}

		axios
			.get(`${API_SERVER_HOST}/api/user/${userId}`)
			.then((res) => {
				setUser({
					userId:
						res.data.userId ??
						res.data.USER_ID,
					loginId:
						res.data.loginId ??
						res.data.LOGIN_ID,
					name:
						res.data.name ??
						res.data.NAME,
					nickname:
						res.data.nickname ??
						res.data.NICKNAME,
					email:
						res.data.email ??
						res.data.EMAIL,
					phone:
						res.data.phone ??
						res.data.PHONE,
					profileImage:
						res.data.profileImage ??
						res.data.PROFILE_IMAGE,
					createdAt:
						res.data.createdAt ??
						res.data.CREATED_AT
				})
			})
			.catch((error) => {
				console.error(
					"회원정보 조회 실패:",
					error
				)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const menuClass = (menu: string) =>
		[
			"w-full border-l-4 px-5 py-4 text-left text-sm font-bold transition",
			activeMenu === menu
				? "border-sky-700 bg-sky-50 text-sky-700"
				: "border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-sky-700"
		].join(" ")

	const loadingScreen = (
		<div className="border border-neutral-200 bg-white px-6 py-16 text-center text-sm text-neutral-500 shadow-sm">
			회원 정보를 불러오는 중입니다.
		</div>
	)

	if (loading) {
		return loadingScreen
	}

	if (!user) {
		return (
			<div className="border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
				<div className="font-bold text-neutral-700">
					회원 정보를 불러오지 못했습니다.
				</div>

				<div className="mt-2 text-sm text-neutral-500">
					다시 로그인한 후 이용해주세요.
				</div>
			</div>
		)
	}

	return (
		<div className="w-full">
			<section className="border-b border-sky-200 bg-sky-100 px-6 py-7">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center">
					<div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-sky-100 shadow-sm">
						{user.profileImage ? (
							<img
								src={`${API_SERVER_HOST}/api/user/view/${user.profileImage}`}
								alt="프로필"
								className="h-full w-full object-cover"
							/>
						) : (
							<span className="text-2xl font-extrabold text-sky-700">
								{user.nickname?.slice(0, 1) ||
									user.name?.slice(0, 1) ||
									"T"}
							</span>
						)}
					</div>

					<div>
						<div className="text-sm font-bold text-sky-700">
							MY TRIPROAD
						</div>

						<h1 className="mt-1 text-2xl font-extrabold text-sky-900">
							{user.nickname || user.name} 회원님
						</h1>
					</div>
				</div>
			</section>

			<div className="mt-6 flex flex-col gap-6 lg:flex-row">
				<aside className="h-fit w-full overflow-hidden border border-neutral-200 bg-white shadow-sm lg:w-56 lg:shrink-0">
					<button
						type="button"
						className={menuClass("booking")}
						onClick={() =>
							setActiveMenu("booking")
						}
					>
						예약 내역
					</button>

					<button
						type="button"
						className={menuClass("calendar")}
						onClick={() =>
							setActiveMenu("calendar")
						}
					>
						여행 캘린더
					</button>

					<button
						type="button"
						className={menuClass("checklist")}
						onClick={() =>
							setActiveMenu("checklist")
						}
					>
						체크리스트
					</button>

					<button
						type="button"
						className={menuClass("wishlist")}
						onClick={() =>
							setActiveMenu("wishlist")
						}
					>
						찜 목록
					</button>

					<button
						type="button"
						className={menuClass("review")}
						onClick={() =>
							setActiveMenu("review")
						}
					>
						나의 후기
					</button>

					<button
						type="button"
						className={menuClass("qna")}
						onClick={() =>
							setActiveMenu("qna")
						}
					>
						내 문의
					</button>

					<button
						type="button"
						className={menuClass("profile")}
						onClick={() =>
							setActiveMenu("profile")
						}
					>
						회원정보 수정
					</button>
                    <button
                        type="button"
                        className={menuClass("password")}
                        onClick={() => setActiveMenu("password")}
                    >
                        비밀번호 변경
                    </button>
				</aside>

				<main className="min-w-0 flex-1">
					{activeMenu === "booking" && (
						<BookingListPage
							userId={user.userId}
						/>
					)}

					{activeMenu === "calendar" && (
						<CalendarPage
							userId={user.userId}
						/>
					)}

					{activeMenu === "checklist" && (
						<ChecklistPage
							userId={user.userId}
						/>
					)}

					{activeMenu === "wishlist" && (
						<WishlistPage
							userId={user.userId}
						/>
					)}

					{activeMenu === "review" && (
						<ReviewPage
							userId={user.userId}
						/>
					)}

					{activeMenu === "qna" && (
						<MyQnaPage
							userId={user.userId}
						/>
					)}

					{activeMenu === "profile" && (
						<ProfileEditPage user={user} />
					)}
                    {activeMenu === "password" && (
                        <ChangePasswordPage />
                    )}
				</main>
			</div>
		</div>
	)
}

export default ListPage