import { lazy, Suspense } from "react";
import { Navigate } from "react-router";



const Loading = () => <div>Loading...</div>;
const BookingIndex = lazy(() => import("../pages/booking/indexPage"));
const BookingList  = lazy(() => import("../pages/booking/listPage"));
const BookingHold  = lazy(() => import("../pages/booking/holdPage"));


const bookingRouter = () => {
    return (
        {
            path: 'booking',
            Component: BookingIndex,
            children: [
                {
                    // 빈 경로로 접근할 때 /booking/list로 리다이렉트
                    // 기본적으로 booking 리스트 페이지로 이동
                    // Navigate 컴포넌트를 사용하여 리다이렉트 설정
                    path: "",
                    element: <Navigate to={"/booking/list"} />  // 기본 경로로 접근 시 /booking/list로 리다이렉트
                },
                {
                    // 마이페이지 - 회원별 예약 내역 조회 화면
                    path: "list",
                    element: <Suspense fallback={<Loading />}><BookingList /></Suspense>
                },
                {
                    // 예약 선점 화면 - 상품 상세에서 "예약하기" 클릭 시 진입
                    // useParams로 scheduleId 받아서 일정 정보 + 잔여 인원 조회
                    path: "hold/:scheduleId",
                    element: <Suspense fallback={<Loading />}><BookingHold /></Suspense>
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




export default bookingRouter;