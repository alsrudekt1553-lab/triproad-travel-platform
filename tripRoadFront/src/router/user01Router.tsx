import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Loading...</div>;
const User01Index = lazy(() =>  import("../pages/user01/indexPage"));
const User01Add   = lazy(() =>  import("../pages/user01/addPage"));
const User01Login = lazy(() =>  import("../pages/user01/loginPage"));
const User01FindLoginId = lazy(() => import("../pages/user01/findLoginIdPage"));
const User01ResetPassword = lazy(() => import("../pages/user01/resetPasswordPage"));
const user01Router = () => {
    return (
        {
            path: 'user01',
            Component: User01Index,
            children: [
                {
                    path: "",
                    element: <Navigate to={"/user01/add"} />
                },
                {
                    path: "add",
                    element: <Suspense fallback={<Loading />}><User01Add /></Suspense>
                },
                {
                    path: "login",
                    element: <Suspense fallback={<Loading/>}><User01Login /></Suspense>
                },
                {
                    path: "findLoginId",
                    element: <Suspense fallback={<Loading/>}><User01FindLoginId /></Suspense>
                },
                {
                    path: "resetPassword",
                    element: <Suspense fallback={<Loading/>}><User01ResetPassword /></Suspense>
                },
             ]
        }
    )
}

export default user01Router;
