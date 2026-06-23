import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { API_SERVER_HOST } from "../../api/apiConfig"

interface Props {
  products: Admin01Product[]
  regions: Admin01Region[]
  themes: Admin01Theme[]
}

const PAGE_SIZE = 10

function AdminProductListComponent({
  products,
  regions,
  themes
}: Props) {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const pageProducts = products.slice(startIndex, startIndex + PAGE_SIZE)

  const getRegionName = (regionId: number) => {
    const region = regions.find(
      (item) => item.mcode === regionId
    )

    return region?.codeContents ?? "-"
  }

  const getThemeName = (themeCode: number) => {
    const theme = themes.find(
      (item) => item.themeCode === themeCode
    )

    return theme?.themeName ?? "-"
  }

  useEffect(() => {
    setPage(1)
  }, [products])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const handleClickAddSchedule = (productId: number) => {
    navigate({
      pathname: "../addSchedule",
      search: `productId=${productId}`
    })
  }

  if (products.length === 0) {
    return (
      <div className="border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500 shadow-sm">
        검색 조건에 맞는 상품이 없습니다.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto border border-neutral-200 bg-white shadow-sm">
      <table className="w-full text-center text-sm">
        <thead className="bg-sky-50 text-neutral-700">
          <tr>
            <th className="border-b border-neutral-200 p-3">상품 ID</th>
            <th className="border-b border-neutral-200 p-3">이미지</th>
            <th className="border-b border-neutral-200 p-3">상품명</th>
            <th className="border-b border-neutral-200 p-3">지역</th>
            <th className="border-b border-neutral-200 p-3">테마</th>
            <th className="border-b border-neutral-200 p-3">가격</th>
            <th className="border-b border-neutral-200 p-3">일정</th>
          </tr>
        </thead>
        <tbody>
          {pageProducts.map((product) => (
            <tr
              key={product.productId}
              tabIndex={0}
              onClick={() =>
                navigate(`../product/${product.productId}`)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`../product/${product.productId}`)
                }
              }}
              className="cursor-pointer transition hover:bg-sky-50/60"
            >
              <td className="border-b border-neutral-100 p-3">{product.productId}</td>
              <td className="border-b border-neutral-100 p-3">
                {product.imageName ? (
                  <img
                    alt={product.productName}
                    className="mx-auto h-16 w-20 object-cover"
                    src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(product.imageName)}`}
                  />
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
              <td className="border-b border-neutral-100 p-3 font-semibold text-neutral-800">{product.productName}</td>
              <td className="border-b border-neutral-100 p-3">
                {getRegionName(product.regionId)}
              </td>
              <td className="border-b border-neutral-100 p-3">
                {getThemeName(product.themeCode)}
              </td>
              <td className="border-b border-neutral-100 p-3">{product.price?.toLocaleString()}원</td>
              <td className="border-b border-neutral-100 p-3">
                <button
                  type="button"
                  className="rounded-md border border-teal-600 bg-white px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClickAddSchedule(product.productId)
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                  }}
                >
                  일정 등록
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-neutral-200 p-3 text-sm">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="border border-neutral-300 px-3 py-1 disabled:cursor-not-allowed disabled:text-neutral-400"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNo) => (
            <button
              key={pageNo}
              type="button"
              onClick={() => setPage(pageNo)}
              className={`border px-3 py-1 ${
                page === pageNo
                  ? "border-sky-700 bg-sky-700 text-white"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {pageNo}
            </button>
          ))}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="border border-neutral-300 px-3 py-1 disabled:cursor-not-allowed disabled:text-neutral-400"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminProductListComponent