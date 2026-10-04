import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { PageTitle } from "./FacultyDashboard";

export default function Profile(){
  const {user}=useAuth();
  return <AppShell admin={user?.role==="admin"}>
    <PageTitle title="Profile" subtitle="Your AssetPortal account information."/>
    <div className="profile-card"><div className="profile-avatar">{user?.name?.charAt(0)}</div><div className="profile-details"><h2>{user?.name}</h2><p>{user?.email}</p><div className="profile-info-row"><span>Role</span><strong>{user?.role}</strong></div>{user?.role==="faculty"&&<div className="profile-info-row"><span>Department</span><strong>{user?.department||"Not Assigned"}</strong></div>}</div></div>
  </AppShell>
}
