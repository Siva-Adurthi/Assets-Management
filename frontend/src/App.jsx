import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyAssets from "./pages/FacultyAssets";
import SearchAssets from "./pages/SearchAssets";
import DepartmentAssets from "./pages/DepartmentAssets";
import AssetDetails from "./pages/AssetDetails";
import MyRequests from "./pages/MyRequests";
import MyAssets from "./pages/MyAssets";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAssets from "./pages/AdminAssets";
import AdminDepartments from "./pages/AdminDepartments";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import AdminRequests from "./pages/AdminRequests";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function RoleHome(){
  const {user}=useAuth();
  return <Navigate to={user?(user.role==="admin"?"/admin/dashboard":"/faculty/dashboard"):"/"} replace/>;
}

export default function App(){
  return <Routes>
    <Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
    <Route element={<ProtectedRoute/>}>
      <Route path="/faculty/dashboard" element={<FacultyDashboard/>}/>
      <Route path="/faculty/assets" element={<FacultyAssets/>}/><Route path="/faculty/assets/:id" element={<AssetDetails/>}/>
      <Route path="/faculty/search" element={<SearchAssets/>}/><Route path="/faculty/departments" element={<DepartmentAssets/>}/>
      <Route path="/faculty/requests" element={<MyRequests/>}/><Route path="/faculty/my-assets" element={<MyAssets/>}/><Route path="/profile" element={<Profile/>}/>
    </Route>
    <Route element={<ProtectedRoute admin/>}>
      <Route path="/admin/dashboard" element={<AdminDashboard/>}/><Route path="/admin/assets" element={<AdminAssets/>}/>
      <Route path="/admin/departments" element={<AdminDepartments/>}/><Route path="/admin/requests" element={<AdminRequests/>}/>
      <Route path="/admin/reports" element={<AdminReports/>}/><Route path="/admin/users" element={<AdminUsers/>}/>
    </Route>
    <Route path="/app" element={<RoleHome/>}/><Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}
