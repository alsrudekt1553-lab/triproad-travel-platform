import { useActionState, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { getAdminRegionList, getAdminThemeList, postAddProduct } from "../../api/admin01Api"
import ResultModal from "../common/resultModal"
import PendingModal from "../common/pendingModal"
import axios from "axios"

const initState: Admin01ProductAddResult = {
  result: 0,
  error: ""
}

const addProductAction = async (
  _state: Admin01ProductAddResult,
  formData: FormData
): Promise<Admin01ProductAddResult> => {
  const productName = formData.get("productName") as string

  if (!productName) {
    return { result: 0, error: "상품명을 입력하세요" }
  }

  try {
    await postAddProduct(formData)
    return { result: 1, error: "" }
  } catch (error: unknown) {
    let errorMsg = "상품 등록 중 오류가 발생했습니다."

    if (axios.isAxiosError(error)) {
      errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        errorMsg
    }

    return { result: 0, error: errorMsg }
  }
}

function AddProductComponent() {
  const [state, action, isPending] = useActionState(addProductAction, initState)
  const navigate = useNavigate()
  const [regions, setRegions] = useState<Admin01Region[]>([])
  const [themes, setThemes] = useState<Admin01Theme[]>([])
  const [showResultModal, setShowResultModal] = useState(false)

  useEffect(() => {
    getAdminRegionList()
      .then(setRegions)
      .catch(() => setRegions([]))

    getAdminThemeList()
      .then(setThemes)
      .catch(() => setThemes([]))
  }, [])

  useEffect(() => {
    if (state.error || state.result !== 0) {
      setShowResultModal(true)
    }
  }, [state.result, state.error])

  return (
    <>
      {isPending && <PendingModal />}

      {showResultModal && state.error && (
        <ResultModal
          title="상품 등록 실패"
          content={state.error}
          variant="error"
          callbackFn={() => setShowResultModal(false)}
        />
      )}

      {showResultModal && state.result !== 0 && !state.error && (
        <ResultModal
          title="상품 등록 완료"
          content="여행 패키지 상품이 등록되었습니다."
          variant="success"
          callbackFn={() => {
            setShowResultModal(false)
            navigate("../productList")
          }}
        />
      )}

      <form
        action={action}
        className="border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
          <div>
            <label htmlFor="regionId" className="mb-2 block text-sm font-bold text-neutral-700">
              지역
            </label>
            <select
              id="regionId"
              name="regionId"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">지역 선택</option>
              {regions.map((region) => (
                <option key={region.mcode} value={region.mcode}>
                  {region.codeContents}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="themeCode" className="mb-2 block text-sm font-bold text-neutral-700">
              테마
            </label>
            <select
              id="themeCode"
              name="themeCode"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">테마 선택</option>
              {themes.map((theme) => (
                <option key={theme.themeCode} value={theme.themeCode}>
                  {theme.themeName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="productName" className="mb-2 block text-sm font-bold text-neutral-700">
              상품명
            </label>
            <input
              id="productName"
              name="productName"
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="mb-2 block text-sm font-bold text-neutral-700">
              상품 설명
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              className="w-full resize-y rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-bold text-neutral-700">
              가격
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="imageFile" className="mb-2 block text-sm font-bold text-neutral-700">
              대표 이미지
            </label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              className="w-full rounded-md border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 file:mr-4 file:rounded-md file:border-0 file:bg-sky-100 file:px-4 file:py-2 file:font-semibold file:text-sky-700"
            />
          </div>

          <div className="mt-2 md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              상품 등록
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddProductComponent