import { Outlet } from "react-router";

function IndexPage() {


    return (
    <div>
        <div className=" w-full flex m-2 p-2">

        </div>
        <div className="flex flex-wrap w-full">
            <Outlet />  
        </div>   
    </div>


    );
}

export default IndexPage;
