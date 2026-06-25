import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { API_SERVER_HOST } from "../../api/apiConfig"
import {
  getAdminProductDetail,
  getAdminRegionList,
  getAdminScheduleList,
  getAdminThemeList
} from "../../api/admin01Api"

function AdminProductReadComponent() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Admin01Product | null>(null)
  const [schedules, setSchedules] = useState<Admin01Schedule[]>([])
  const [regions, setRegions] = useState<Admin01Region[]>([])
  const [themes, setThemes] = useState<Admin01Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (
    !productId ||
    Number.isNaN(Number(productId)) ||
    Number(productId) <= 0
    ) {
    setError("상품 번호가 올바르지 않습니다.")
    setLoading(false)
    return
    }

    Promise.all([
      getAdminProductDetail(Number(productId)),
      getAdminScheduleList(Number(productId)),
      getAdminRegionList(),
      getAdminThemeList()
    ])
      .then(([productData, scheduleData, regionData, themeData]) => {
        setProduct(productData)
        setSchedules(scheduleData)
        setRegions(regionData)
        setThemes(themeData)
      })
      .catch(() => {
        setError("상품 정보를 불러오지 못했습니다.")
      })
      .finally(() => setLoading(false))
  }, [productId])

  const regionName =
    regions.find((region) => region.mcode === product?.regionId)
      ?.codeContents ?? "-"

  const themeName =
    themes.find((theme) => theme.themeCode === product?.themeCode)
      ?.themeName ?? "-"

  if (loading) {
    return <div className="p-6 text-neutral-500">불러오는 중...</div>
  }

  if (error || !product) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900">
            상품 상세
          </h2>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/admin01/product/${product.productId}/modify`)
          }
          className="rounded-md bg-sky-700 px-4 py-2 text-sm font-bold text-white hover:bg-sky-800"
        >
          상품 정보 수정
        </button>
      </div>

      <div className="grid gap-6 border border-neutral-200 bg-white p-6 shadow-sm md:grid-cols-[280px_1fr]">
        <div className="h-56 bg-neutral-100">
          {product.imageName ? (
            <img
              src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(product.imageName)}`}
              alt={product.productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              이미지 없음
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-extrabold">
            {product.productName}
          </h3>

          <div className="mt-3 text-sm text-neutral-500">
            {regionName} · {themeName}
          </div>

          <div className="mt-3 text-xl font-bold text-red-500">
            {product.price.toLocaleString()}원
          </div>

          <div className="mt-5 whitespace-pre-wrap border-t border-neutral-200 pt-5 text-sm leading-7 text-neutral-700">
            {product.description}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-extrabold">등록 일정</h3>

          <button
            type="button"
            onClick={() =>
              navigate(`/admin01/addSchedule?productId=${product.productId}`)
            }
            className="rounded-md border border-teal-600 px-4 py-2 text-sm font-bold text-teal-700 hover:bg-teal-50"
          >
            일정 추가
          </button>
        </div>

        {schedules.length === 0 ? (
          <div className="border border-neutral-200 bg-white p-8 text-center text-neutral-500">
            등록된 일정이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.scheduleId}
                className="border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold">
                      {schedule.title}
                    </h4>
                    <div className="mt-2 text-sm text-neutral-500">
                      {schedule.startDate.slice(0, 10)}
                      {" ~ "}
                      {schedule.endDate.slice(0, 10)}
                      {" · "}
                      최대 {schedule.maxHeadcount}명
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin01/product/${product.productId}/schedule/${schedule.scheduleId}/modify`
                      )
                    }
                    className="h-fit rounded-md border border-sky-600 px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-50"
                  >
                    일정 수정
                  </button>
                </div>

                <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-neutral-600">
                  {schedule.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/admin01/productList")}
        className="mt-6 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
      >
        목록으로
      </button>
    </div>
  )
}

export default AdminProductReadComponent