import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Loading...</div>;
const PaymentIndex   = lazy(() => import("../pages/payment/indexPage"));
const PaymentList    = lazy(() => import("../pages/payment/listPage"));
const PaymentSuccess = lazy(() => import("../pages/payment/successPage"));
const PaymentCancel  = lazy(() => import("../pages/payment/cancelPage"));
const PaymentFail    = lazy(() => import("../pages/payment/failPage"));
const PointHistory   = lazy(() => import("../pages/userpoint/pointHistoryPage"));

const paymentRouter = () => {
    return (
        {
            path: 'payment',
            Component: PaymentIndex,
            children: [
                {
                    path: "",
                    element: <Navigate to={"/booking/list"} />
                },
                {
                    path: "list",
                    element: <Suspense fallback={<Loading />}><PaymentList /></Suspense>
                },

                {
                    path: "success/:bookingId",
                    element: <Suspense fallback={<Loading />}><PaymentSuccess /></Suspense>
                },
                {
                    path: "cancel/:bookingId",
                    element: <Suspense fallback={<Loading />}><PaymentCancel /></Suspense>
                },
                {
                    path: "fail/:bookingId",
                    element: <Suspense fallback={<Loading />}><PaymentFail /></Suspense>
                },
                {
                    path: "point-history",
                    element: <Suspense fallback={<Loading />}><PointHistory /></Suspense>
                },
            ]
        }
    )
}

export default paymentRouter;