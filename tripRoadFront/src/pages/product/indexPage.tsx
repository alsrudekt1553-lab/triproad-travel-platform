import { Outlet } from "react-router"

function IndexPage() {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  )
}

export default IndexPage;