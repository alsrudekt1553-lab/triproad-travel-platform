import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"
import { API_SERVER_HOST } from "../../api/apiConfig"
import ResultModal from "../common/resultModal"
import PendingModal from "../common/pendingModal"

type ResetStep = "info" | "code" | "password"

function ResetPasswordComponent() {
  const navigate = useNavigate()

  const [step, setStep] = useState<ResetStep>("info")
  const [pending, setPending] = useState(false)
  const [resultModal, setResultModal] = useState<{
    title: string
    content: string
    variant: "success" | "error" | "info"
    callbackFn?: () => void
  } | null>(null)

  const [userId, setUserId] = useState<number>(0)
  const [loginId, setLoginId] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailToken, setEmailToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showResend, setShowResend] = useState(false)

  const sendCode = async () => {
    if (!loginId || !name || !email) {
      setResultModal({
        title: "입력 오류",
        content: "아이디, 이름, 이메일을 모두 입력해주세요.",
        variant: "error"
      })
      return
    }

    setPending(true)

    try {
      const res = await axios.post(`${API_SERVER_HOST}/api/user/password-reset/send-code`, {
        loginId,
        name,
        email
      })

      setUserId(res.data.USER_ID)
      setEmailToken("")
      setShowResend(false)
      setStep("code")

      setResultModal({
        title: "인증코드 발송",
        content: res.data.MESSAGE || "인증코드가 발송되었습니다.",
        variant: "success"
      })
    } catch (error: any) {
      setResultModal({
        title: "인증코드 발송 실패",
        content: error.response?.data?.MESSAGE || "인증코드 발송 중 오류가 발생했습니다.",
        variant: "error"
      })
    } finally {
      setPending(false)
    }
  }

  const verifyCode = async () => {
    if (!emailToken) {
      setResultModal({
        title: "입력 오류",
        content: "인증코드를 입력해주세요.",
        variant: "error"
      })
      return
    }

    setPending(true)

    try {
      const res = await axios.post(`${API_SERVER_HOST}/api/user/password-reset/verify-code`, {
        userId,
        emailToken
      })

      setShowResend(false)
      setStep("password")

      setResultModal({
        title: "인증 완료",
        content: res.data.MESSAGE || "인증되었습니다.",
        variant: "success"
      })
    } catch (error: any) {
      const code = error.response?.data?.code

      if (code === "TOKEN_MISMATCH" || code === "TOKEN_EXPIRED" || code === "TOO_MANY_FAIL") {
        setShowResend(true)
      }

      setResultModal({
        title: "인증 실패",
        content: error.response?.data?.MESSAGE || "인증코드 확인 중 오류가 발생했습니다.",
        variant: "error"
      })
    } finally {
      setPending(false)
    }
  }

  const changePassword = async () => {
    if (!password || !confirmPassword) {
      setResultModal({
        title: "입력 오류",
        content: "새 비밀번호를 입력해주세요.",
        variant: "error"
      })
      return
    }

    if (password !== confirmPassword) {
      setResultModal({
        title: "입력 오류",
        content: "비밀번호가 일치하지 않습니다.",
        variant: "error"
      })
      return
    }

    setPending(true)

    try {
      const res = await axios.put(`${API_SERVER_HOST}/api/user/password-reset/change`, {
        userId,
        password
      })

      setResultModal({
        title: "비밀번호 재설정",
        content: res.data.MESSAGE || "비밀번호가 변경되었습니다.",
        callbackFn: () => navigate({ pathname: "../login" }),
        variant: "success"
      })
    } catch (error: any) {
      setResultModal({
        title: "비밀번호 재설정 실패",
        content: error.response?.data?.MESSAGE || "비밀번호 변경 중 오류가 발생했습니다.",
        variant: "error"
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mt-8">
      {pending && <PendingModal />}

      {resultModal && (
        <ResultModal
          title={resultModal.title}
          content={resultModal.content}
          variant={resultModal.variant}
          callbackFn={() => {
            const callbackFn = resultModal.callbackFn
            setResultModal(null)
            if (callbackFn) {
              callbackFn()
            }
          }}
        />
      )}

      {step === "info" && (
        <div>
          <div className="mb-5">
            <label
              htmlFor="resetLoginId"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              아이디
            </label>

            <input
              id="resetLoginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="resetName"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              이름
            </label>

            <input
              id="resetName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              required
              autoComplete="name"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="resetEmail"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              이메일
            </label>

            <input
              id="resetEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              required
              autoComplete="email"
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
              type="button"
              disabled={pending}
              className="rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
              onClick={sendCode}
            >
              인증코드 발송
            </button>
          </div>
        </div>
      )}

      {step === "code" && (
        <div>
          <div className="mb-5 border-l-4 border-teal-500 bg-teal-50 px-4 py-3 text-sm leading-6 text-neutral-600">
            입력한 이메일로 발송된 6자리 인증코드를 입력해주세요.
          </div>

          <div className="mb-6">
            <label
              htmlFor="emailToken"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              인증코드
            </label>

            <input
              id="emailToken"
              value={emailToken}
              onChange={(e) => setEmailToken(e.target.value.toUpperCase())}
              maxLength={6}
              required
              autoComplete="one-time-code"
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-center text-lg font-bold tracking-widest outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={pending}
              className="w-full rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
              onClick={verifyCode}
            >
              인증하기
            </button>

            {showResend && (
              <button
                type="button"
                className="w-full rounded-md border border-teal-600 bg-white px-4 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
                onClick={sendCode}
              >
                인증코드 재발송
              </button>
            )}

            <button
              type="button"
              className="text-sm font-semibold text-neutral-500 hover:text-sky-700"
              onClick={() => setStep("info")}
            >
              이전 단계로
            </button>
          </div>
        </div>
      )}

      {step === "password" && (
        <div>
          <div className="mb-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            이메일 인증이 완료되었습니다.
          </div>

          <div className="mb-5">
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              새 비밀번호
            </label>

            <input
              id="newPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              새 비밀번호 확인
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="button"
            disabled={pending}
            className="w-full rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            onClick={changePassword}
          >
            비밀번호 변경
          </button>
        </div>
      )}
    </div>
  )
}

export default ResetPasswordComponent