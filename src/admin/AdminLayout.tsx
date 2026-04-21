import { Outlet } from "react-router-dom"
import Sidebar from "../components/navbar_components/Sidebar"


function AdminLayout() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  )
}

export default AdminLayout