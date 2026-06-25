import { Outlet } from "react-router";
function IndexPage() {
    return (
        <div className="flex flex-wrap w-full">
            <Outlet />
        </div>
    );
}

export default IndexPage;