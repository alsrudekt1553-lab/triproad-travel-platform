import { useEffect, useState } from "react";
import { getList } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/pageComponent";

// ListComponent은 TodoList 페이지에서 보여지는 컴포넌트로,
//  API getList 호출 --> http://localhost:8481/api/todo/list   
function ListComponent() {

        const {page, size, refresh , moveToList , moveToRead}:UseCustomMoveReturn = useCustomMove();
        // 서버에서 데이터를 아직 받아오지 않았을 때 serverData가 undefined 상태로 있다가, 
        // 서버 응답이 오면 setServerData를 통해 PageResponseDTO<Todo> 타입의 실제 데이터로 
        // 채워진다는 것을 명시
        // 페이지 정보와 데이터 리스트를 저장하는 상태, 초기값은 undefined
        const [serverData, setServerData] = useState<PageResponseDTO<Todo>|undefined>(); 

        useEffect(() => {
            console.log("ListComponent useEffect");
            // ListComponent이 마운트될 때마다 실행되는 코드
            // 예: API 호출, 이벤트 리스너 등록 등
            getList({page: page, size: size}).then(response => {
                console.log("ListComponent getList API 호출  Response:", response);
                setServerData(response);
            }); 
        }, [page, size, refresh ]); // page / size / refresh 가 변경될 때마다 useEffect가 실행됨


    return ( 
        <div className="border-2  border-blue-100 mt-10 mr-2 ml-2">
            { 
             // ListComponent은 TodoList 페이지에서 보여지는 컴포넌트로,
             // TodoList 페이지는 URL의 쿼리 파라미터를 읽어서 페이지 번호와 페이지 크기를 표시하는 역할을 함                
             // serverData가 undefined가 아닐 때만 아래 JSX를 렌더링하도록 조건부 렌더링을 사용
             serverData && 
             <>
                <div className="flex flex-wrap mx-auto justify-center p-6">
                    {serverData.dtoList.map(todo=> (
                        <div 
                        key={todo.tno} 
                        className="w-full min-w-[400px] p-2 m-2 rounded shadow-md "
                        onClick={() => moveToRead(todo.tno)}  // moveToRead 함수를 호출하여 해당 tno의 상세 페이지로 이동
                        >
                            <div className="flex ">
                                <div className="font-extrabold text-2xl p-2 w-1/12">
                                    {todo.tno}
                                </div>
                                <div className="text-1xl m-1 p-2 w-7/12 font-extrabold">
                                    {todo.title}
                                </div>
                                <div className="text-1xl m-1 p-2 w-4/12 font-medium">
                                    {todo.due_date}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                <PageComponent serverData={serverData} movePage={moveToList} />
             </>
             }
 
            
        </div>
     );
}

export default ListComponent;   