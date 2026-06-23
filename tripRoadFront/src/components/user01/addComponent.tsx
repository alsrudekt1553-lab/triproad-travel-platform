import axios from "axios"
import { API_SERVER_HOST } from "../../api/apiConfig"
import { useActionState, useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import ResultModal from "../common/resultModal"
import PendingModal from "../common/pendingModal"

interface User01AddResult {
  result: number
  error: string
}

const initState: User01AddResult = {
  result: 0,
  error: ''
}

const addAsyncAction = async (_state: User01AddResult, formData: FormData): Promise<User01AddResult> => {
    console.log("addAsyncAction........")

    const loginId = formData.get("loginId") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    if (!loginId) {
        return { result: 0, error: "Insert Login ID" }
    }

    if ((email.match(/@/g) || []).length !== 1) {
        return { result: 0, error: "이메일 형식이 틀립니다." }
    }

    if (phone && !/^\d{3}-\d{4}-\d{4}$/.test(phone)) {
        return { result: 0, error: "전화번호는 000-0000-0000 형식으로 작성해주세요." }
    }

    try {
        const checkRes = await axios.get(`${API_SERVER_HOST}/api/user/check-login-id/${loginId}`)
        if (checkRes.data.DUPLICATED) {
            return { result: 0, error: "사용할 수 없는 ID입니다." }
        }

        const res = await axios.post(`${API_SERVER_HOST}/api/user/register`, formData)
        return { result: res.data.USER_ID, error: '' }
    } catch (error: any) {
        const errorMsg = error.response?.data?.MESSAGE || "회원가입 중 오류가 발생했습니다."
        return { result: 0, error: errorMsg }
    }
}

function AddComponent() {
    const [state, action, isPending] = useActionState(addAsyncAction, initState)
    const [showModal, setShowModal] = useState(false)
    const [duplicateMsg, setDuplicateMsg] = useState('')
    const [emailMsg, setEmailMsg] = useState('')
    const [phoneMsg, setPhoneMsg] = useState('')
    const loginIdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const navigate = useNavigate()

    const handleLoginIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (loginIdTimerRef.current) clearTimeout(loginIdTimerRef.current)
        if (!value) {
            setDuplicateMsg('')
            return
        }
        loginIdTimerRef.current = setTimeout(async () => {
            try {
                const res = await axios.get(`${API_SERVER_HOST}/api/user/check-login-id/${value}`)
                setDuplicateMsg(res.data.DUPLICATED ? '사용할 수 없는 ID입니다.' : '')
            } catch {
                setDuplicateMsg('')
            }
        }, 300)
    }

    const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        if (!value) {
            setEmailMsg('')
            return
        }

        const atCount = (value.match(/@/g) || []).length
        setEmailMsg(atCount === 1 ? '' : '이메일 형식이 틀립니다.')
    }

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        if (!value) {
            setPhoneMsg('')
            return
        }

        setPhoneMsg(
            /^\d{3}-\d{4}-\d{4}$/.test(value)
                ? ''
                : '전화번호는 000-0000-0000 형식으로 작성해주세요.'
        )
    }

    useEffect(() => {
        if (state.error || state.result !== 0) {
            setShowModal(true)
        }
    }, [state.result, state.error])

    const closeAndGoToStart = () => {
        setShowModal(false)
        navigate({pathname: '/user01/login'})
    }

    return (
        <div className="mt-8">
            {isPending && <PendingModal/>}

            {showModal && state.error &&
                <ResultModal
                    title="회원가입 오류"
                    content={state.error}
                    variant="error"
                    callbackFn={() => setShowModal(false)}
                />
            }

            {showModal && state.result !== 0 && !state.error &&
                <ResultModal
                    title="회원가입 완료"
                    content="회원가입이 완료되었습니다."
                    variant="success"
                    callbackFn={closeAndGoToStart}
                />
            }

            <form action={action} autoComplete="off">
                <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="joinLoginId"
                            className="mb-2 block text-sm font-bold text-neutral-700"
                        >
                            아이디
                        </label>

                        <input
                            id="joinLoginId"
                            name="loginId"
                            required
                            autoComplete="username"
                            onChange={handleLoginIdInput}
                            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        />

                        {duplicateMsg && (
                            <div className="mt-1 text-sm text-red-500">
                                {duplicateMsg}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="joinPassword"
                            className="mb-2 block text-sm font-bold text-neutral-700"
                        >
                            비밀번호
                        </label>

                        <input
                            id="joinPassword"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="nickname"
                            className="mb-2 block text-sm font-bold text-neutral-700"
                        >
                            닉네임
                        </label>

                        <input
                            id="nickname"
                            name="nickname"
                            required
                            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-bold text-neutral-700"
                        >
                            이름
                        </label>

                        <input
                            id="name"
                            name="name"
                            required
                            autoComplete="name"
                            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-bold text-neutral-700"
                        >
                            이메일
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="text"
                            required
                            autoComplete="email"
                            onChange={handleEmailInput}
                            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        />

                        {emailMsg && (
                            <div className="mt-1 text-sm text-red-500">
                                {emailMsg}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-bold text-neutral-700"
                        >
                            전화번호
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            placeholder="000-0000-0000"
                            autoComplete="tel"
                            onChange={handlePhoneInput}
                            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        />

                        {phoneMsg && (
                            <div className="mt-1 text-sm text-red-500">
                                {phoneMsg}
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="profileImage"
                            className="mb-2 block text-sm font-bold text-neutral-700"
                        >
                            프로필 사진
                        </label>

                        <input
                            id="profileImage"
                            type="file"
                            name="files"
                            accept="image/*"
                            className="w-full rounded-md border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 file:mr-4 file:rounded-md file:border-0 file:bg-sky-100 file:px-4 file:py-2 file:font-semibold file:text-sky-700"
                        />
                    </div>

                    <div className="mt-2 md:col-span-2">
                        <button
                            type="submit"
                            disabled={
                                isPending ||
                                !!duplicateMsg ||
                                !!emailMsg ||
                                !!phoneMsg
                            }
                            className="w-full rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddComponent;
