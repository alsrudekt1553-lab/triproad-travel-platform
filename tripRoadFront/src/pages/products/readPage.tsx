import axios from "axios";
import type { LoaderFunctionArgs } from "react-router";
import { API_SERVER_HOST } from "../../api/todoApi";
import { useLoaderData } from "react-router";
import ReadComponent from "../../components/products/readComponent";


// LoaderFunctionArgs는 React Router에서 loader 함수의 매개변수 타입(아래 3가지 포함)
// 1.params - URL 경로에서 추출된 동적 매개변수들을 담고 있어.
//          예-->  /products/:pno 경로에서는 params.pno로 접근.
// 2.request - 현재 요청에 대한 Fetch API의 Request 객체야.
// 3.context - 서버 어댑터의 getLoadContext() 함수를 통해 전달되는 컨텍스트 정보.
//             서버 API와 React Router 앱 사이의 연결 다리 역할을 해.
export async function loadProduct({params}: LoaderFunctionArgs) {
    console.log('loadProduct params->',params)
    // URL 경로에서 pno를 추출하고, 숫자로 변환
    // parseInt는 문자열을 정수로 변환하는 함수. 두 번째 인자는 진법을 나타내는 것으로, 10은 10진수를 의미해.
    // 만약 pno가 없으면 0으로 처리해.
    const pno = parseInt(params.pno || '0', 10);
    // 특정 상품 정보를 가져오는 비동기 함수를 정의
    const res = await axios.get(`${API_SERVER_HOST}/api/products/${pno}`)
    console.log('product getOne res.data->',res.data)
    return res.data
}

function ReadPage() {
    // useLoaderData 훅을 사용하여 로더에서 반환된 데이터를 가져와
    // 이 데이터는 loadProduct 함수에서 반환된 상품 정보야.
    const product:ProductDTO = useLoaderData()

    return (  
    <div className="w-full">   
        <div>Product Read</div>
        <ReadComponent product={product}></ReadComponent>
    </div>

  );
}

export default ReadPage;