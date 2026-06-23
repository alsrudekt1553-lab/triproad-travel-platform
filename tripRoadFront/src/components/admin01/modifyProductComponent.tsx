import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, useParams } from "react-router"
import { API_SERVER_HOST } from "../../api/apiConfig"
import {
  getAdminProductDetail,
  getAdminRegionList,
  getAdminThemeList,
  postModifyProduct
} from "../../api/admin01Api"

function ModifyProductComponent() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] =
    useState<Admin01Product | null>(null)
  const [regions, setRegions] =
    useState<Admin01Region[]>([])
  const [themes, setThemes] =
    useState<Admin01Theme[]>([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
      getAdminRegionList(),
      getAdminThemeList()
    ])
      .then(([productData, regionData, themeData]) => {
        setProduct(productData)
        setRegions(regionData)
        setThemes(themeData)
      })
      .catch(() => {
        setError("상품 정보를 불러오지 못했습니다.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [productId])

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!productId || !product) {
      return
    }

    const formData = new FormData(e.currentTarget)

    const regionId = formData.get("regionId")?.toString() ?? ""
    const themeCode = formData.get("themeCode")?.toString() ?? ""

    const productName =
        formData.get("productName")?.toString().trim() ?? ""
    const description =
      formData.get("description")?.toString().trim() ?? ""
    const price = Number(formData.get("price"))

    if (!regionId) {
    alert("지역을 선택해주세요.")
    return
    }

    if (!themeCode) {
    alert("테마를 선택해주세요.")
    return
    }

    if (!productName) {
      alert("상품명을 입력해주세요.")
      return
    }

    if (!description) {
      alert("상품 설명을 입력해주세요.")
      return
    }

    if (Number.isNaN(price) || price < 0) {
      alert("가격을 올바르게 입력해주세요.")
      return
    }

    try {
      setSubmitting(true)

      await postModifyProduct(formData)

      alert("상품 정보가 수정되었습니다.")
      navigate(`/admin01/product/${productId}`)
    } catch {
      alert("상품 수정 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

    if (loading) {
        return (
        <div className="p-6 text-sm text-neutral-500">
            상품 정보를 불러오는 중입니다.
        </div>
        )
    }

    if (error || !product) {
    return (
        <div>
        <div className="border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
            {error || "상품 정보가 없습니다."}
        </div>

        <button
            type="button"
            onClick={() => navigate("/admin01/productList")}
            className="mt-4 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
        >
            상품 목록으로
        </button>
        </div>
    )
    }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-neutral-900">
          상품 정보 수정
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          여행 패키지의 기본 정보와 대표 이미지를 수정합니다.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <input
          name="productId"
          type="hidden"
          value={product.productId}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="regionId"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              지역
            </label>

            <select
                id="regionId"
                name="regionId"
                defaultValue={product.regionId}
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
            <label
              htmlFor="themeCode"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              테마
            </label>

            <select
                id="themeCode"
                name="themeCode"
                defaultValue={product.themeCode}
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
            <label
              htmlFor="productName"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              상품명
            </label>

            <input
              id="productName"
              name="productName"
              defaultValue={product.productName}
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              상품 설명
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={product.description}
              required
              className="w-full resize-y rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              가격
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              defaultValue={product.price}
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="imageFile"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              새 대표 이미지
            </label>

            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              className="w-full rounded-md border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 file:mr-4 file:rounded-md file:border-0 file:bg-sky-100 file:px-4 file:py-2 file:font-semibold file:text-sky-700"
            />

            <p className="mt-2 text-xs text-neutral-500">
              선택하지 않으면 기존 이미지가 유지됩니다.
            </p>
          </div>

          {product.imageName && (
            <div className="md:col-span-2">
              <div className="mb-2 text-sm font-bold text-neutral-700">
                현재 대표 이미지
              </div>

              <img
                src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(product.imageName)}`}
                alt={product.productName}
                className="h-48 w-full max-w-sm object-cover"
              />
            </div>
          )}

          <div className="mt-2 flex gap-3 md:col-span-2">
            <button
              type="button"
              onClick={() =>
                navigate(`/admin01/product/${product.productId}`)
              }
              className="w-1/3 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {submitting ? "수정 중..." : "상품 정보 수정"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ModifyProductComponent