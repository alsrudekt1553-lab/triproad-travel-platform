import axios from "axios";
import { API_SERVER_HOST } from "../../api/apiConfig"
import { useActionState, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import ResultModal from "../common/resultModal"
import PendingModal from "../common/pendingModal"


interface User01LoginResult {
  result: number
  error: string
  loginId?: string
}

const initState: User01LoginResult = {
  result: 0,
  error: ''
}

const loginAsyncAction = async (_state: User01LoginResult, formData: FormData): Promise<User01LoginResult> => {

    console.log("loginAsyncAction........")

    await new Promise(resolve => setTimeout(resolve, 1000))

    const loginId = formData.get("loginId") as string
    const password = formData.get("password") as string

    if (!loginId || !password) {
        return { result: 0, error: "Please enter both login ID and password" }
    }
    
    try {
        const res = await axios.post(`${API_SERVER_HOST}/api/user/login`, {
            loginId,
            password
        }, {
            withCredentials: true
        })

        if (res.data.result == 1) {
            //  sessionStorage 안에 저장된 내용을 가져오는 방법
            //  const userId = sessionStorage.getItem("USER_ID");
            //  const loginId = sessionStorage.getItem("loginId");     
            //  const role = sessionStorage.getItem("role");
            sessionStorage.setItem("USER_ID", String(res.data.USER_ID))
            sessionStorage.setItem("loginId", res.data.loginId)
            sessionStorage.setItem("role", String(res.data.role))

            localStorage.setItem("loginUser", JSON.stringify({
                USER_ID: res.data.USER_ID,
                LOGIN_ID: res.data.loginId,
                NICKNAME: res.data.NICKNAME,
                NAME: res.data.NAME,
                ROLE: res.data.role
            }))
         } else {
            const errorMsg =  "Login failed"
            sessionStorage.removeItem("USER_ID")
            sessionStorage.removeItem("loginId")
            sessionStorage.removeItem("role")
            localStorage.removeItem("loginUser")
             return { result: 0, error: errorMsg }
        }
        
        return { result: res.data.result, error: '' }
    } catch (error: any) {
        const errorMsg = error.response?.data?.MESSAGE || "Login failed"
        const errLoginId = error.response?.data?.loginId
        sessionStorage.removeItem("USER_ID")
        sessionStorage.removeItem("loginId")
        sessionStorage.removeItem("role")
        localStorage.removeItem("loginUser")

        return { result: 0, error: errorMsg, loginId: errLoginId }
    }
}

function LoginComponent() {
    const [state, action ,isPending] = useActionState(loginAsyncAction, initState)
    const [hideErrorModal, setHideErrorModal] = useState(false)
    const [loginIdValue, setLoginIdValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        if (state.result === 1) {
            const redirect =
                new URLSearchParams(window.location.search)
                    .get("redirect")

            navigate(redirect || "/", {
                replace: true
            })
        }
    }, [state.result, navigate])

    useEffect(() => {
        if (!isPending && state.result === 0 && state.error) {
            setPasswordValue("")

            if (state.loginId) {
                setLoginIdValue(state.loginId)
            } else {
                setLoginIdValue("")
            }
        }
    }, [isPending, state.result, state.error, state.loginId])

    return (
    <div className="mt-8">
        {isPending && <PendingModal/>}
        
        {!isPending && !hideErrorModal && state.result === 0 && state.error &&
            <ResultModal
                title="로그인 실패"
                content={state.error}
                variant="error"
                callbackFn={() => setHideErrorModal(true)}
            />
        }

        <form
            action={action}
            autoComplete="off"
            onSubmit={() => setHideErrorModal(false)}
        >
            <div className="mb-5">
                <label
                    htmlFor="loginId"
                    className="mb-2 block text-sm font-bold text-neutral-700"
                >
                    아이디
                </label>

                <input
                    id="loginId"
                    name="loginId"
                    value={loginIdValue}
                    onChange={(e) => setLoginIdValue(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                    required
                    autoComplete="username"
                />
            </div>

            <div className="mb-6">
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-neutral-700"
                >
                    비밀번호
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                    required
                    autoComplete="current-password"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
                로그인
            </button>

            <div className="mt-5 flex items-center justify-center gap-4 text-sm">
                <button
                    type="button"
                    className="font-semibold text-neutral-500 hover:text-sky-700"
                    onClick={() => navigate({ pathname: "../findLoginId" })}
                >
                    아이디 찾기
                </button>

                <span className="text-neutral-300">|</span>

                <button
                    type="button"
                    className="font-semibold text-neutral-500 hover:text-sky-700"
                    onClick={() => navigate({ pathname: "../resetPassword" })}
                >
                    비밀번호 재설정
                </button>
            </div>
        </form>
    </div>
    )

}

export default LoginComponent;
