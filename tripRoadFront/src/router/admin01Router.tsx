import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Loading...</div>;
const Admin01Index = lazy(() => import("../pages/admin01/indexPage"));
const Admin01List  = lazy(() => import("../pages/admin01/listPage"));
const Admin01Add  = lazy(() => import("../pages/admin01/addPage"));
const Admin01AddSchedule = lazy(() => import("../pages/admin01/addSchedulePage"));
const Admin01ProductList = lazy(() => import("../pages/admin01/productListPage"));
const Admin01ProductRead = lazy(
  () => import("../pages/admin01/productReadPage")
)

const Admin01ProductModify = lazy(
  () => import("../pages/admin01/productModifyPage")
)

const Admin01ScheduleModify = lazy(
  () => import("../pages/admin01/scheduleModifyPage")
)

const admin01Router = () => {
    return (
        {
            path: 'admin01',
            Component: Admin01Index,
            children: [
                {
                    // 빈 경로로 접근할 때 /admin01/list로 리다이렉트
                    // 기본적으로 admin01 리스트 페이지로 이동
                    // Navigate 컴포넌트를 사용하여 리다이렉트 설정
                    path: "",
                    element: <Navigate to={"/admin01/list"} />  // 기본 경로로 접근 시 /admin01/list로 리다이렉트
                },
                {
                    path: "list",
                    element: <Suspense fallback={<Loading />}><Admin01List /></Suspense>
                },
                {
                    path: "add",
                    element: <Suspense fallback={<Loading />}><Admin01Add /></Suspense>
                },
                {
                    path: "addSchedule",
                    element: <Suspense fallback={<Loading />}><Admin01AddSchedule /></Suspense>
                },
                {
                    path: "productList",
                    element: <Suspense fallback={<Loading />}><Admin01ProductList /></Suspense>
                },
                {
                    path: "product/:productId",
                    element: (
                        <Suspense fallback={<Loading />}>
                        <Admin01ProductRead />
                        </Suspense>
                    )
                },
                {
                    path: "product/:productId/modify",
                    element: (
                        <Suspense fallback={<Loading />}>
                        <Admin01ProductModify />
                        </Suspense>
                    )
                },
                {
                    path: "product/:productId/schedule/:scheduleId/modify",
                    element: (
                        <Suspense fallback={<Loading />}>
                        <Admin01ScheduleModify />
                        </Suspense>
                    )
                },
            //     {
            //         path: "add",
            //         element: <Suspense fallback={<Loading />}><TodoAdd /></Suspense>

            //     },
            //     {
            //         // /todo/read/:tno 경로로 접근할 때 TodoRead 컴포넌트를 렌더링
            //         // :tno는 URL 파라미터로, Todo의 고유 번호를 나타냄
            //         // 이 컴포넌트는 특정 Todo의 상세 정보를 보여주는 페이지
            //         path: "read/:tno",
            //         element: <Suspense fallback={<Loading/>}><TodoRead /></Suspense> 
            //     },
            //     {
            //         path: "modify/:tno",
            //         element: <Suspense fallback={<Loading/>}><TodoModify/></Suspense> 
            //     },
             ]


        }


    )
}









export default admin01Router;