import { Outlet, useLocation, useNavigate } from "react-router";

function IndexPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "productList") {
      return (
        location.pathname.endsWith("/productList") ||
        location.pathname.includes("/admin01/product/")
      )
    }

    return location.pathname.endsWith(`/${path}`)
  }

  const menuClass = (path: string) =>
    [
      "whitespace-nowrap border-b-2 px-5 py-4 text-sm font-bold transition",
      isActive(path)
        ? "border-sky-700 text-sky-700"
        : "border-transparent text-neutral-500 hover:border-sky-200 hover:text-sky-700"
    ].join(" ")

  return (
    <div className="w-full">
      <section className="border-b border-sky-200 bg-sky-100 px-6 py-6">
        <h1 className="text-2xl font-extrabold text-sky-900">
          관리자 페이지
        </h1>
      </section>

      <nav className="border-b border-neutral-200 bg-white px-6">
        <div className="flex overflow-x-auto">
          <button
            type="button"
            className={menuClass("list")}
            onClick={() => navigate({ pathname: "list" })}
          >
            예약 목록
          </button>

          <button
            type="button"
            className={menuClass("productList")}
            onClick={() => navigate({ pathname: "productList" })}
          >
            상품 목록
          </button>

          <button
            type="button"
            className={menuClass("add")}
            onClick={() => navigate({ pathname: "add" })}
          >
            상품 등록
          </button>

          <button
            type="button"
            className={menuClass("addSchedule")}
            onClick={() => navigate({ pathname: "addSchedule" })}
          >
            일정 등록
          </button>
        </div>
      </nav>

      <div className="py-7">
        <Outlet />
      </div>
    </div>
  )
}

export default IndexPage;