import { useSearchParams } from "react-router";
import ListComponent from "../../components/todo/listComponent";


function ListPage() {

    // URL의 쿼리 파라미터(query parameters)를 쉽게 읽고 수정
    // URL의 ? 뒤에 오는 부분(예: /list?page=2&size=10) 에서 
    // size , page 값을 가져오거나 설정할 때 사용 
    const [queryParams] = useSearchParams();

    const page = queryParams.get('page');
    const size = queryParams.get('size');
 
    console.log('ListPage page->', page, 'size->', size);

    return ( 
        <div className="bg-white rounded-lg p-4 m-2 w-full">
            <div className="text-4xl">Todo List Page  {page} {size} </div>
            <ListComponent />
        </div>
     );
}

export default ListPage;