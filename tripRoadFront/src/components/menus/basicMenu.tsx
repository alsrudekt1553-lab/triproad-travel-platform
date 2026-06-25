import { NavLink, useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_SERVER_HOST } from "../../api/apiConfig"

function BasicMenu() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(false)
    const [role, setRole] = useState("")

    useEffect(() => {
        const loginId = sessionStorage.getItem("loginId")
        const sessionRole = sessionStorage.getItem("role")

        setIsLogin(!!loginId)
        setRole(sessionRole || "")
    }, [location.pathname])

    const handleLogout = async () => {
        try {
            await axios.post(`${API_SERVER_HOST}/api/user/logout`, null, {
                withCredentials: true
            })
        } catch (error) {
            console.log("logout error", error)
        }

        sessionStorage.removeItem("USER_ID")
        sessionStorage.removeItem("loginId")
        sessionStorage.removeItem("role")
        localStorage.removeItem("loginUser")

        setIsLogin(false)
        setRole("")
        navigate("/")
    }

    const navClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-sky-700 font-extrabold"
            : "text-neutral-700 hover:text-sky-700"

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <NavLink to="/" className="text-2xl font-extrabold text-sky-700">
                    TripRoad
                </NavLink>

                <div className="flex items-center gap-4 text-sm font-semibold">
                    {isLogin ? (
                        <>
                            {role === "900" ? (
                                <NavLink
                                    to="/admin01"
                                    className="text-neutral-700 hover:text-sky-700"
                                >
                                    관리자 페이지
                                </NavLink>
                            ) : (
                                <NavLink
                                    to="/myPage"
                                    className="text-neutral-700 hover:text-sky-700"
                                >
                                    마이페이지
                                </NavLink>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full bg-sky-700 px-4 py-2 text-white hover:bg-sky-800"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/user01/login" className="text-neutral-700 hover:text-sky-700">
                                로그인
                            </NavLink>
                            <NavLink
                                to="/user01/add"
                                className="rounded-full bg-sky-700 px-4 py-2 text-white hover:bg-sky-800"
                            >
                                회원가입
                            </NavLink>
                        </>
                    )}
                </div>
            </div>

            <nav className="border-t border-neutral-100 bg-[#faf8f3]">
                <div className="mx-auto flex max-w-6xl justify-center gap-10 px-4 py-3 text-sm">
                    <NavLink to="/product/list" className={navClass}>
                        여행 패키지
                    </NavLink>
                    <NavLink to="/review/list" className={navClass}>
                        후기
                    </NavLink>
                    <NavLink to="/qna/list" className={navClass}>
                        1:1문의
                    </NavLink>
                    <NavLink to="/booking/list" className={navClass}>
                        예약
                    </NavLink>
                </div>
            </nav>
        </header>
    )
}

export default BasicMenu