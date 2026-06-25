import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Loading...</div>;
const ProductAllReviewPage = lazy(() => import("../pages/review/ProductAllReviewPage"));
const ReviewIndex = lazy(() => import("../pages/review/indexPage"));
const ReviewList = lazy(() => import("../pages/review/listPage"));

const ProductReviewPage = lazy(() => import("../pages/review/ProductReviewPage"));
const ReviewAddPage = lazy(() => import("../pages/review/ReviewAddPage"));
const ReviewModifyPage = lazy(() => import("../pages/review/ReviewModifyPage"));

const reviewRouter = () => {
  return {
    path: "review",
    Component: ReviewIndex,
    children: [
      {
        path: "",
        element: <Navigate to={"/review/list"} />,
      },
      {
        path: "list",
        element: (
          <Suspense fallback={<Loading />}>
            <ReviewList />
          </Suspense>
        ),
      },
      {
        path: "schedule/:scheduleId",
        element: (
          <Suspense fallback={<Loading />}>
            <ProductReviewPage />
          </Suspense>
        ),
      },
      {
        path: "add/:scheduleId",
        element: (
          <Suspense fallback={<Loading />}>
            <ReviewAddPage />
          </Suspense>
        ),
      },
      {
        path: "modify/:reviewId",
        element: (
          <Suspense fallback={<Loading />}>
            <ReviewModifyPage />
          </Suspense>
        ),
      },
      {
  path: "product/:productId",
  element: (
    <Suspense fallback={<Loading />}>
      <ProductAllReviewPage />
    </Suspense>
  ),
},
    ],
  };
};

export default reviewRouter;