import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Loading...</div>;
const PaymentIndex   = lazy(() => import("../pages/payment/indexPage"));
const PaymentList    = lazy(() => import("../pages/payment/listPage"));
const PaymentSuccess = lazy(() => import("../pages/payment/successPage"));
const PaymentCancel  = lazy(() => import("../pages/payment/cancelPage"));
const PaymentFail    = lazy(() => import("../pages/payment/failPage"));

const paymentRouter = () => {
    return (
        {
            path: 'payment',
            Component: PaymentIndex,
            children: [
                {
                    // 빈 경로로 접근할 때 /payment/list로 리다이렉트
                    path: "",
                    element: <Navigate to={"/payment/list"} />
                },
                {
                    // 마이페이지 - 회원별 결제 내역 조회 화면
                    path: "list",
                    element: <Suspense fallback={<Loading />}><PaymentList /></Suspense>
                },

                {
                    // 카카오 결제 완료 후 콜백 URL
                    // readyComponent의 approvalUrl과 매칭
                    // 형식: /payment/success/{bookingId}?pg_token=xxx
                    path: "success/:bookingId",
                    element: <Suspense fallback={<Loading />}><PaymentSuccess /></Suspense>
                },
                {
                    // 카카오 결제 취소 시 콜백 URL
                    // readyComponent의 cancelUrl과 매칭
                    // 형식: /payment/cancel/{bookingId}
                    // 진입 시 백 DELETE /api/payment/cancel/{bookingId} 호출 → PAYMENT/BOOKING 즉시 정리
                    path: "cancel/:bookingId",
                    element: <Suspense fallback={<Loading />}><PaymentCancel /></Suspense>
                },
                {
                    // 카카오 결제 실패 시 콜백 URL
                    // readyComponent의 failUrl과 매칭
                    // 형식: /payment/fail/{bookingId}?error_code=xxx&error_msg=yyy
                    // 진입 시 백 DELETE /api/payment/cancel/{bookingId} 호출 → PAYMENT/BOOKING 즉시 정리
                    // (fail/cancel 둘 다 "결제 안 됨" 상태라 같은 cancel API 재사용)
                    path: "fail/:bookingId",
                    element: <Suspense fallback={<Loading />}><PaymentFail /></Suspense>
                },
            ]
        }
    )
}

export default paymentRouter;