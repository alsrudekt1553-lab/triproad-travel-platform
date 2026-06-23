import { createBrowserRouter } from "react-router";
import BasicLayout from "../layouts/basicLayout";
import { lazy, Suspense } from "react";
import Loading from "../assets/loading";
import todoRouter from "./todoRouter";
import ProductsRouter from "./productsRouter";
import user01Router from "./user01Router";
import admin01Router from "./admin01Router";
import reviewRouter from "./reviewRouter";
import bookingRouter from "./bookingRouter";
import mainRouter from "./mainRouter";
import myPageRouter from "./myPageRouter";
import paymentRouter from "./paymentRouter";
import productRouter from "./productRouter";
import qnaRouter from "./qnaRouter";
import reviewImageRouter from "./reviewImageRouter";

const Main = lazy(()=> import("../pages/mainPage"))
// createBrowserRouter 함수는 브라우저 환경에 맞는 라우터를 생성하는 API
// 이 안에 라우팅할 경로들과 컴포넌트 구조를 배열 형태
// 1. 최상위 객체는 기본 경로 path: ""를 가지며, 여기서 Component: BasicLayout을 렌더링
//    이 BasicLayout은 공통 레이아웃 컴포넌트로, 하위 라우터들이 이 안에서 보이도록 구성 
// 2. children 배열에는 하위 경로들이 정의
//   1) 첫 번째 항목은 index: true로, 즉 루트 경로("/")에 해당
//      여기에 렌더링될 컴포넌트는 Main인데, Suspense로 감싸서 로딩 중일 때 <Loading />
//      컴포넌트를 보여주도록 처리. 
//      이러면 Main 컴포넌트를 동적으로 불러올 때 사용자가 로딩 상태를 보게 구성.
//    2) 두 번째 객체는 path: 'about'으로 /about 경로에 대응
//       마찬가지로 About 컴포넌트를 Suspense로 감싸서 동적 로딩과 로딩 UI를 구현
// 3. 이 라우터 설정은 기본 레이아웃 안에 메인 페이지와 어바웃 페이지를 동적 렌더링하면서 
//    라우팅해주는 구성, 로딩 상태 UI 처리도 포함. 

//    React Router 6에서 권장하는 방식으로 코드 스플리팅과 로딩 관리 용이
const router = createBrowserRouter([
  {
        path: "",
        Component: BasicLayout,
        children : [
            {
                index: true,
                element: <Suspense fallback={<Loading/>}><Main/></Suspense>
            },
            todoRouter(),
            ProductsRouter(),
            admin01Router(),
            bookingRouter(),
            mainRouter(),
            myPageRouter(),
            paymentRouter(),
            productRouter(),
            qnaRouter(),
            reviewRouter(),
            reviewImageRouter(),
            user01Router(),

        ]
  }
]);


export default router;
