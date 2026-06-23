
import { Outlet } from "react-router"
import BasicMenu from "../components/menus/basicMenu"

// BasicLayout은 전체 페이지 구조를 만드는 컴포넌트
// 최상단에 BasicMenu라는 메뉴 컴포넌트가 먼저 오고,
// 그 아래 큰 박스(div)가 있어서 내부에 main 영역과 aside 사이드바가 같이 배치
function BasicLayout() {
    return(
      <>
        <BasicMenu />

        <main className="min-h-[calc(100vh-170px)] bg-[#faf8f3]">
          <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-neutral-500">
            <div className="font-bold text-neutral-800">TripRoad</div>
            <div className="mt-1">여행 패키지 예약 서비스</div>
            <div className="mt-2 text-xs">© 2026 TripRoad. All rights reserved.</div>
          </div>
        </footer>
      </>

    )
}

export default BasicLayout