import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Loading...</div>;

const QnaIndex = lazy(() => import("../pages/qna/indexPage"));
const QnaList = lazy(() => import("../pages/qna/listPage"));
const QnaAdd = lazy(() => import("../pages/qna/addPage"));
const QnaRead = lazy(() => import("../pages/qna/readPage"));
const QnaModify = lazy(() => import("../pages/qna/modifyPage.tsx"));

const qnaRouter = () => {
    return {
        path: "qna",
        Component: QnaIndex,
        children: [
            {
                path: "",
                element: <Navigate to={"/qna/list"} replace />,
            },
            {
                path: "list",
                element: (
                    <Suspense fallback={<Loading />}>
                        <QnaList />
                    </Suspense>
                ),
            },
            {
                path: "add",
                element: (
                    <Suspense fallback={<Loading />}>
                        <QnaAdd />
                    </Suspense>
                ),
            },
            {
                path: "read/:qnaId",
                element: (
                    <Suspense fallback={<Loading />}>
                        <QnaRead />
                    </Suspense>
                ),
            },
            {
                path: "modify/:qnaId",
                element: (
                    <Suspense fallback={<Loading />}>
                        <QnaModify />
                    </Suspense>
                ),
            },
        ],
    };
};

export default qnaRouter;