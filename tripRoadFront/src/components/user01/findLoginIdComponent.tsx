import axios from "axios"
import { API_SERVER_HOST } from "../../api/apiConfig"
import { useActionState, useState, useEffect } from "react"
import { useNavigate } from "react-router"
import ResultModal from "../common/resultModal"
import PendingModal from "../common/pendingModal"

interface FindLoginIdResult {
  result: number
  error: string
  email?: string
}

const initState: FindLoginIdResult = {
  result: 0,
  error: ''
}

const findLoginIdAsyncAction = async (_state: FindLoginIdResult, formData: FormData): Promise<FindLoginIdResult> => {
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    if (!name || !email) {
        return { result: 0, error: "이름과 이메일을 입력해주세요." }
    }

    try {
        const res = await axios.post(`${API_SERVER_HOST}/api/user/find-login-id`, { name, email })
        return { result: res.data.result, email: res.data.email, error: res.data.MESSAGE }
    } catch (error: any) {
        const errorMsg = error.response?.data?.MESSAGE || "오류가 발생했습니다."
        return { result: 0, error: errorMsg }
    }
}

function FindLoginIdComponent() {
    const [state, action, isPending] = useActionState(findLoginIdAsyncAction, initState)
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (state.result === 1 || (state.result === 0 && state.error)) {
            setShowModal(true)
        }
    }, [state.result, state.error])

    const closeErrorModal = () => {
        setShowModal(false)
    }

    return (
    <div className="mt-8">
        {isPending && <PendingModal/>}
        
        {showModal && state.result === 1 &&
            <ResultModal
                title="아이디 찾기 완료"
                content={`회원님의 아이디를 ${state.email}로 발송했습니다.`}
                variant="success"
                callbackFn={closeErrorModal}
            />
        }

        {showModal && state.result === 0 && state.error &&
            <ResultModal
                title="아이디 찾기 실패"
                content={state.error}
                variant="error"
                callbackFn={closeErrorModal}
            />
        }

        <form action={action} autoComplete="off">
            <div className="mb-5">
                <label
                    htmlFor="findName"
                    className="mb-2 block text-sm font-bold text-neutral-700"
                >
                    이름
                </label>

                <input
                    id="findName"
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                />
            </div>

            <div className="mb-6">
                <label
                    htmlFor="findEmail"
                    className="mb-2 block text-sm font-bold text-neutral-700"
                >
                    이메일
                </label>

                <input
                    id="findEmail"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    className="rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-neutral-600 transition hover:bg-neutral-50"
                    onClick={() => navigate({ pathname: "../login" })}
                >
                    취소
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
                >
                    아이디 찾기
                </button>
            </div>
        </form>
    </div>
    )
}

export default FindLoginIdComponent
