import { Outlet, useNavigate } from "react-router";

function IndexPage() {
    // useNavigate는 React Router에서 제공하는 훅으로, 프로그래밍 방식으로 경로를 변경할 때 사용
    // navigate 함수는 이 훅에서 반환되며, 이를 호출하면 지정한 경로로 이동할 수 있음
    const navigate = useNavigate() 

    const handleClickList = () => {
        navigate({pathname: 'list'});
    }

    const handleClickAdd = () => {
        navigate({pathname: 'add'});
    }

    return (
    <div>
        <div className=" w-full flex m-2 p-2">
            <div className="text-xl flex m-1 p-2 w-20 font-extrabold text-center underline"
                onClick={handleClickList}
            >

                List

            </div>
            <div className="text-xl m-1 p-2 w-20 font-extrabold text-center underline"
                onClick={handleClickAdd}
            >
                
                Add
                
            </div>
        </div>
        <div className="flex flex-wrap w-full">
            {/* Outlet 컴포넌트는 React Router에서 현재 라우트에 맞는 자식 컴포넌트를 렌더링하는 역할 */}
            <Outlet />  
        </div>   
    </div>


    );
}

export default IndexPage;


                // <button onClick={()=>navigate('/')}>Main</button>
                // <button onClick={()=>navigate('/about')}>About</button>
