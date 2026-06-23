import { Outlet } from "react-router";

function IndexPage() {


  return (
  <div style={{ width: "100%" }}>
    <div className="flex flex-wrap w-full">
      <Outlet />
    </div>
  </div>
);
}

export default IndexPage;