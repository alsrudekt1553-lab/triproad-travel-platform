import { useEffect, useMemo, useState } from "react"
import {
  getAdminProductList,
  getAdminRegionList,
  getAdminThemeList
} from "../../api/admin01Api"
import AdminProductListComponent from "../../components/admin01/adminProductListComponent"

function ProductListPage() {
  const [products, setProducts] = useState<Admin01Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [regions, setRegions] = useState<Admin01Region[]>([])
  const [themes, setThemes] = useState<Admin01Theme[]>([])
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("")
  const [keyword, setKeyword] = useState("")

  useEffect(() => {
    Promise.all([
      getAdminProductList(),
      getAdminRegionList(),
      getAdminThemeList()
    ])
      .then(([productData, regionData, themeData]) => {
        setProducts(productData)
        setRegions(regionData)
        setThemes(themeData)
      })
      .catch(() => {
        setError("상품 목록을 불러오지 못했습니다.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return products.filter((product) => {
      const matchesRegion =
        !selectedRegion ||
        product.regionId === Number(selectedRegion)

      const matchesTheme =
        !selectedTheme ||
        product.themeCode === Number(selectedTheme)

      const matchesKeyword =
        !normalizedKeyword ||
        product.productName
          .toLowerCase()
          .includes(normalizedKeyword)

      return matchesRegion && matchesTheme && matchesKeyword
    })
  }, [products, selectedRegion, selectedTheme, keyword])

  const handleReset = () => {
    setSelectedRegion("")
    setSelectedTheme("")
    setKeyword("")
  }

  if (loading) {
    return <div className="p-4 w-full">상품 목록 불러오는 중...</div>
  }

  if (error) {
    return <div className="p-4 w-full text-red-500">{error}</div>
  }

  return (
    <section className="w-full">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900">
            상품 목록
          </h2>
        </div>

        <div className="text-sm font-semibold text-neutral-500">
          검색 결과 {filteredProducts.length}개
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-[180px_180px_1fr_auto]">
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
        >
          <option value="">전체 지역</option>

          {regions.map((region) => (
            <option key={region.mcode} value={region.mcode}>
              {region.codeContents}
            </option>
          ))}
        </select>

        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
        >
          <option value="">전체 테마</option>

          {themes.map((theme) => (
            <option key={theme.themeCode} value={theme.themeCode}>
              {theme.themeName}
            </option>
          ))}
        </select>

        <input
          type="search"
          value={keyword}
          placeholder="상품명을 입력하세요"
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
        />

        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
        >
          초기화
        </button>
      </div>

      <AdminProductListComponent
        products={filteredProducts}
        regions={regions}
        themes={themes}
      />
    </section>
  )
}

export default ProductListPage