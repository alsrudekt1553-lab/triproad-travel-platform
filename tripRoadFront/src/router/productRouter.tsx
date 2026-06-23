import { lazy, Suspense } from "react";
import { Navigate } from "react-router";



const Loading = () => <div>Loading...</div>;
const ProductIndex = lazy(() => import("../pages/product/indexPage"));
const ProductList = lazy(() => import("../pages/product/listPage"));
const ProductRead = lazy(() => import("../pages/product/readPage"));

const productRouter = () => {
    return (
        {
            path: 'product',
            Component: ProductIndex,
            children: [
                {
                    path: "",
                    element: <Navigate to={"/product/list"} />
                },
                {
                    path: "list",
                    element: <Suspense fallback={<Loading />}><ProductList /></Suspense>
                },
                {
                    path: "read/:productId",
                    element: <Suspense fallback={<Loading />}><ProductRead /></Suspense>
                },
             ]


        }


    )
}









export default productRouter;