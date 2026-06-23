import { lazy, Suspense } from "react";
import { Navigate } from "react-router";



const Loading = () => <div>Loading...</div>;
const TodoIndex = lazy(() => import("../pages/todo/indexPage"));
const TodoList  = lazy(() => import("../pages/todo/listPage"));
const TodoAdd   = lazy(() => import("../pages/todo/addPage"));
const TodoRead  = lazy(() => import("../pages/todo/readPage"));
const TodoModify = lazy(() => import("../pages/todo/modifyPage"));

const todoRouter = () => {
    return (
        {
            path: 'todo',
            Component: TodoIndex,
            children: [
                {
                    // 빈 경로로 접근할 때 /todo/list로 리다이렉트
                    // 기본적으로 todo 리스트 페이지로 이동
                    // Navigate 컴포넌트를 사용하여 리다이렉트 설정
                    path: "",
                    element: <Navigate to={"/todo/list"} />  // 기본 경로로 접근 시 /todo/list로 리다이렉트
                },
                {
                    path: "list",
                    element: <Suspense fallback={<Loading />}><TodoList /></Suspense>
                },
                {
                    path: "add",
                    element: <Suspense fallback={<Loading />}><TodoAdd /></Suspense>

                },
                {
                    // /todo/read/:tno 경로로 접근할 때 TodoRead 컴포넌트를 렌더링
                    // :tno는 URL 파라미터로, Todo의 고유 번호를 나타냄
                    // 이 컴포넌트는 특정 Todo의 상세 정보를 보여주는 페이지
                    path: "read/:tno",
                    element: <Suspense fallback={<Loading/>}><TodoRead /></Suspense> 
                },
                {
                    path: "modify/:tno",
                    element: <Suspense fallback={<Loading/>}><TodoModify/></Suspense> 
                },
            ]


        }


    )
}

export default todoRouter;