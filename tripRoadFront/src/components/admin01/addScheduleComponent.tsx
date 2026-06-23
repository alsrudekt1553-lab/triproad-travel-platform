import { useActionState, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { getAdminProductList, getAdminRegionList, postAddSchedule } from "../../api/admin01Api"
import ResultModal from "../common/resultModal"
import PendingModal from "../common/pendingModal"
import axios from "axios"

const initState: Admin01ScheduleAddResult = {
  result: 0,
  error: ""
}

const addScheduleAction = async (
  _state: Admin01ScheduleAddResult,
  formData: FormData
): Promise<Admin01ScheduleAddResult> => {
  const productId = formData.get("productId") as string
  const title = formData.get("title") as string
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string
  const maxHeadcount = formData.get("maxHeadcount") as string

  if (!productId) {
    return { result: 0, error: "일정을 등록할 상품을 선택해주세요." }
  }

  if (!title) {
    return { result: 0, error: "일정 제목을 입력하세요" }
  }

  if (!startDate || !endDate) {
    return { result: 0, error: "시작일과 종료일을 입력하세요" }
  }

  if (!maxHeadcount) {
    return { result: 0, error: "최대 인원을 입력하세요" }
  }

  try {
    await postAddSchedule(formData)
    return { result: 1, error: "" }
  } catch (error: unknown) {
    let errorMsg = "일정 등록 중 오류가 발생했습니다."

    if (axios.isAxiosError(error)) {
      errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        errorMsg
    }

    return { result: 0, error: errorMsg }
  }
}

function AddScheduleComponent() {
  const [state, action, isPending] = useActionState(
    addScheduleAction,
    initState
  )
  const [showResultModal, setShowResultModal] = useState(false)

  const [products, setProducts] = useState<Admin01Product[]>([])
  const [regions, setRegions] = useState<Admin01Region[]>([])
  const [keyword, setKeyword] = useState("")
  const [selectedProduct, setSelectedProduct] =
    useState<Admin01Product | null>(null)
  const [productLoading, setProductLoading] = useState(true)
  const [productError, setProductError] = useState("")

  const [queryParams] = useSearchParams()
  const navigate = useNavigate()
  const productIdParam = queryParams.get("productId") || ""

  useEffect(() => {
    setProductLoading(true)
    setProductError("")

    Promise.all([
      getAdminProductList(),
      getAdminRegionList()
    ])
      .then(([productData, regionData]) => {
        setProducts(productData)
        setRegions(regionData)

        if (!productIdParam) {
          return
        }

        const selected = productData.find(
          (product) =>
            product.productId === Number(productIdParam)
        )

        if (selected) {
          setSelectedProduct(selected)
          setKeyword(selected.productName)
        }
      })
      .catch(() => {
        setProducts([])
        setRegions([])
        setProductError("상품 목록을 불러오지 못했습니다.")
      })
      .finally(() => {
        setProductLoading(false)
      })
  }, [productIdParam])

	useEffect(() => {
		if (state.error || state.result !== 0) {
			setShowResultModal(true)
		}
	}, [state.result, state.error])

  const normalizedKeyword = keyword.trim().toLowerCase()

  const filteredProducts = normalizedKeyword
    ? products
        .filter((product) =>
          product.productName
            .toLowerCase()
            .includes(normalizedKeyword)
        )
        .slice(0, 10)
    : []

  const getRegionName = (regionId: number) => {
    const region = regions.find(
      (item) => item.mcode === regionId
    )

    return region?.codeContents || `지역 코드 ${regionId}`
  }

  return (
    <>
      {isPending && <PendingModal />}

      {showResultModal && state.error && (
        <ResultModal
          title="일정 등록 실패"
          content={state.error}
          variant="error"
          callbackFn={() => setShowResultModal(false)}
        />
      )}

      {showResultModal && state.result !== 0 && !state.error && (
        <ResultModal
          title="일정 등록 완료"
          content="여행 패키지 일정이 등록되었습니다."
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
          <div className="relative md:col-span-2">
            <label
              htmlFor="productKeyword"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              상품 검색
            </label>

            <input
              id="productKeyword"
              type="text"
              value={keyword}
              placeholder="상품명을 입력하세요"
              autoComplete="off"
              disabled={productLoading}
              onChange={(e) => {
                setKeyword(e.target.value)
                setSelectedProduct(null)
              }}
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100 disabled:bg-neutral-100"
            />

            {productLoading && (
              <div className="mt-2 text-sm text-neutral-500">
                상품 목록을 불러오는 중입니다.
              </div>
            )}

            {productError && (
              <div className="mt-2 text-sm font-semibold text-red-500">
                {productError}
              </div>
            )}

            {!productLoading &&
              !selectedProduct &&
              normalizedKeyword &&
              filteredProducts.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto border border-neutral-200 bg-white shadow-lg">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.productId}
                      type="button"
                      className="flex w-full items-center justify-between gap-4 border-b border-neutral-100 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-sky-50"
                      onClick={() => {
                        setSelectedProduct(product)
                        setKeyword(product.productName)
                      }}
                    >
                      <span>
                        <span className="block font-bold text-neutral-800">
                          {product.productName}
                        </span>
                        <span className="mt-1 block text-xs text-neutral-500">
                          {getRegionName(product.regionId)}
                        </span>
                      </span>

                      <span className="shrink-0 font-semibold text-teal-700">
                        {product.price?.toLocaleString()}원
                      </span>
                    </button>
                  ))}
                </div>
              )}

            {!productLoading &&
              !selectedProduct &&
              normalizedKeyword &&
              filteredProducts.length === 0 && (
                <div className="mt-2 text-sm text-neutral-500">
                  검색 결과가 없습니다.
                </div>
              )}

            {selectedProduct && (
              <div className="mt-3 border-l-4 border-teal-500 bg-teal-50 px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-neutral-900">
                      {selectedProduct.productName}
                    </div>

                    <div className="mt-1 text-sm text-neutral-600">
                      {getRegionName(selectedProduct.regionId)}
                      {" · "}
                      {selectedProduct.price?.toLocaleString()}원
                    </div>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 text-xs font-bold text-teal-700 hover:text-teal-900"
                    onClick={() => {
                      setSelectedProduct(null)
                      setKeyword("")
                    }}
                  >
                    다시 선택
                  </button>
                </div>
              </div>
            )}

            <input
              name="productId"
              type="hidden"
              value={selectedProduct?.productId ?? ""}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="scheduleTitle"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              일정 제목
            </label>

            <input
              id="scheduleTitle"
              name="title"
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="scheduleContent"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              일정 설명
            </label>

            <textarea
              id="scheduleContent"
              name="content"
              rows={5}
              required
              className="w-full resize-y rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              시작일
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              종료일
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="maxHeadcount"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              최대 인원
            </label>

            <input
              id="maxHeadcount"
              name="maxHeadcount"
              type="number"
              min="1"
              max="999"
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <input name="status" type="hidden" value="100" />

          <div className="mt-2 md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              일정 등록
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddScheduleComponent