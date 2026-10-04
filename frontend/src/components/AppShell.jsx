import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell, Box, Building2, ChevronDown, ClipboardList, LayoutDashboard,
  LogOut, Menu, Search, ShieldCheck, UserCircle, Users, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ children, admin = false }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const facultyLinks = [
    { to: "/faculty/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/faculty/assets", label: "View Assets", icon: Box },
    { to: "/faculty/search", label: "Search Assets", icon: Search },
    { to: "/faculty/departments", label: "Department Assets", icon: Building2 },
    { to: "/faculty/requests", label: "My Requests", icon: ClipboardList },
    { to: "/faculty/my-assets", label: "My Assets", icon: Box },
    { to: "/profile", label: "Profile", icon: UserCircle }
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/assets", label: "Manage Assets", icon: Box },
    { to: "/admin/departments", label: "Manage Departments", icon: Building2 },
    { to: "/admin/requests", label: "Asset Requests", icon: ClipboardList },
    { to: "/admin/reports", label: "View Reports", icon: ClipboardList },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/profile", label: "Profile", icon: UserCircle }
  ];

  const links = admin ? adminLinks : facultyLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <Link to={admin ? "/admin/dashboard" : "/faculty/dashboard"} className="brand">
            <span className="brand-mark"><Box size={18}/></span>
            <span>Asset<span>Portal</span></span>
          </Link>
          <button className="mobile-close" onClick={() => setOpen(false)}><X size={20}/></button>
        </div>

        <div className="role-chip">
          <ShieldCheck size={15}/>
          {admin ? "Administrator" : "Faculty"}
        </div>

        <nav className="side-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}>
              <Icon size={17}/>
              {label}
            </Link>
          ))}
        </nav>

        <button className="logout-link" onClick={handleLogout}>
          <LogOut size={17}/> Logout
        </button>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}><Menu/></button>
          <div className="topbar-spacer" />
          <button className="icon-button"><Bell size={18}/><span className="notification-dot"/></button>
          <div className="user-menu">
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
            <div className="user-meta">
              <strong>{user?.name}</strong>
              <small>{admin ? "Admin" : "Faculty"}</small>
            </div>
            <ChevronDown size={15}/>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
