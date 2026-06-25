import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Loading...</div>;
const BookingIndex  = lazy(() => import("../pages/booking/indexPage"));
const BookingList   = lazy(() => import("../pages/booking/listPage"));
const BookingHold   = lazy(() => import("../pages/booking/holdPage"));
const BookingDetail = lazy(() => import("../pages/booking/detailPage"));

const bookingRouter = () => {
    return (
        {
            path: 'booking',
            Component: BookingIndex,
            children: [
                {
                    path: "",
                    element: <Navigate to={"/booking/list"} /> 
                },
                {
                    path: "list",
                    element: <Suspense fallback={<Loading />}><BookingList /></Suspense>
                },
                {
                    path: "hold/:scheduleId",
                    element: <Suspense fallback={<Loading />}><BookingHold /></Suspense>
                },
                {
                    path: "detail/:bookingId",
                    element: <Suspense fallback={<Loading />}><BookingDetail /></Suspense>
                },

             ]

        }

    )
}


export default bookingRouter;