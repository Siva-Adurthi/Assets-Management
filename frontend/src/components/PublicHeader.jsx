import { Link } from "react-router-dom";
import { Box, LogIn, UserPlus } from "lucide-react";

export default function PublicHeader() {
  return (
    <header className="public-header">
      <Link to="/" className="brand">
        <span className="brand-mark"><Box size={20} /></span>
        <span>Asset<span>Portal</span></span>
      </Link>

      <nav className="public-nav">
        <Link to="/">Home</Link>
        <a href="#about">About</a>
        <a href="#features">Features</a>
      </nav>

      <div className="header-actions">
        <Link className="btn btn-outline" to="/login"><LogIn size={16}/> Login</Link>
        <Link className="btn btn-orange" to="/register"><UserPlus size={16}/> Register</Link>
      </div>
    </header>
  );
}
