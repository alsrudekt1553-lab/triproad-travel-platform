import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { getMainHome } from "../api/mainApi"
import { API_SERVER_HOST } from "../api/apiConfig"

function MainPage() {
  const navigate = useNavigate()
  const [home, setHome] = useState<MainHome | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMainHome()
      .then(setHome)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-6 text-sm text-neutral-500">메인 정보를 불러오는 중...</div>
  }

  const themes = home?.themes || []
  const recommendProducts = home?.recommendProducts || []
  const newProducts = home?.newProducts || []

  return (
    <div className="w-full text-neutral-900">
      <section className="bg-sky-100 px-8 py-7">
        <div className="text-3xl font-extrabold text-sky-800">
          지역별 여행 상품을 한 번에 예약하세요
        </div>
        <div className="mt-3 text-sm text-neutral-600">
          추천 지역, 후기 평점, 예약 가능한 날짜를 메인에서 바로 확인
        </div>
        <button
          type="button"
          onClick={() => navigate("/product/list")}
          className="mt-4 rounded-full bg-sky-700 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-800"
        >
          바로 예약하기
        </button>
      </section>

      <section className="mt-5">
        <div className="mb-3 text-base font-extrabold">인기 카테고리</div>
        <div className="flex flex-wrap gap-3">
          {themes.map((theme) => (
            <button
              key={theme.themeCode}
              type="button"
              onClick={() =>
                navigate(`/product/list?themeCode=${theme.themeCode}`)
              }
              className="min-w-24 rounded-full border border-teal-500 bg-white px-5 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              {theme.themeName}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 text-base font-extrabold">
          별점 높은 추천 상품
        </div>

        {recommendProducts.length === 0 ? (
          <div className="border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
            아직 후기가 등록된 상품이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recommendProducts.map((product) => (
              <div
                key={product.productId}
                onClick={() =>
                  navigate(`/product/read/${product.productId}`)
                }
                className="cursor-pointer overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="h-28 bg-neutral-100">
                  {product.imageName ? (
                    <img
                      alt={product.productName}
                      className="h-full w-full object-cover"
                      src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(product.imageName)}`}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                      이미지 없음
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                      별점 추천
                    </span>

                    {product.averageRating != null && (
                      <span className="text-sm font-extrabold text-amber-500">
                        ★ {product.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 font-extrabold text-neutral-900">
                    {product.productName}
                  </div>

                  <div className="mt-1 text-xs text-neutral-500">
                    {product.regionName} · {product.themeName}
                  </div>

                  <div className="mt-2 text-sm font-bold text-red-500">
                    {product.price?.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-3 text-base font-extrabold">
          신규 상품
        </div>

        {newProducts.length === 0 ? (
          <div className="border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
            등록된 신규 상품이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {newProducts.map((product) => (
              <div
                key={product.productId}
                onClick={() =>
                  navigate(`/product/read/${product.productId}`)
                }
                className="cursor-pointer overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="h-28 bg-neutral-100">
                  {product.imageName ? (
                    <img
                      alt={product.productName}
                      className="h-full w-full object-cover"
                      src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(product.imageName)}`}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                      이미지 없음
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold text-white">
                      신규
                    </span>

                    {product.averageRating != null && (
                      <span className="text-sm font-extrabold text-amber-500">
                        ★ {product.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 font-extrabold text-neutral-900">
                    {product.productName}
                  </div>

                  <div className="mt-1 text-xs text-neutral-500">
                    {product.regionName} · {product.themeName}
                  </div>

                  <div className="mt-2 text-sm font-bold text-red-500">
                    {product.price?.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default MainPage