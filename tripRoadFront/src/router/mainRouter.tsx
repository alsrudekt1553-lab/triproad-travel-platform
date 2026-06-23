import { lazy, Suspense } from "react";
import { Navigate } from "react-router";



const Loading = () => <div>Loading...</div>;
const MainIndex = lazy(() => import("../pages/main/indexPage"));
const MainList  = lazy(() => import("../pages/main/listPage"));


const mainRouter = () => {
    return (
        {
            path: 'main',
            Component: MainIndex,
            children: [
                {
                    // 빈 경로로 접근할 때 /main/list로 리다이렉트
                    // 기본적으로 main 리스트 페이지로 이동
                    // Navigate 컴포넌트를 사용하여 리다이렉트 설정
                    path: "",
                    element: <Navigate to={"/main/list"} />  // 기본 경로로 접근 시 /main/list로 리다이렉트
                },
                {
                    path: "list",
                    element: <Suspense fallback={<Loading />}><MainList /></Suspense>
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









export default mainRouter;