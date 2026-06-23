import axios from "axios";
import { createSearchParams,  useLoaderData,  type LoaderFunctionArgs } from "react-router";
import { API_SERVER_HOST } from "../../api/todoApi";
import ListComponent from "../../components/products/listComponent";



export async function loadProducts({request}: LoaderFunctionArgs) {
    
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const size = url.searchParams.get("size") || "10";

    const queryStr =createSearchParams({page, size}).toString();
    console.log("loadProducts called with queryStr:", queryStr);

    const res = await axios.get(`${API_SERVER_HOST}/api/products/list?${queryStr}`);
    // Check res  
    console.log('ListPage fetch response->', res);
 
    return res.data;
}

const ListPage = () => {

    // useLoaderData()는 React Router에서 제공하는 훅으로, 현재 라우트에 대한 로더 함수에서 반환된 데이터를 가져오는 데 사용
    const pageResponse = useLoaderData()

    return (
        <div className="w-full mt-4 border border-solid border-neutral-300 shadow-md">
            <div className="text-2xl m-4 font-extrabold">
                Products List Page
            </div>
           <ListComponent serverData={pageResponse}></ListComponent>
        </div>
      );


}

export default ListPage;