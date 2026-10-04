import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Building2, Eye, EyeOff, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../utils";

function AuthVisual() {
  return (
    <div className="auth-image login-visual">
      <div className="auth-orb orb-one"/>
      <div className="auth-orb orb-two"/>
      <div className="auth-visual-content">
        <div className="auth-visual-badge"><Box size={24}/> <span>Asset<span>Portal</span></span></div>
        <span className="eyebrow">SMART CAMPUS • SECURE ACCESS</span>
        <h1>Your department assets, all in one place.</h1>
        <p>A secure workspace where faculty can discover assets and administrators can manage every allocation.</p>
        <div className="auth-feature-stack">
          <div><ShieldCheck size={17}/><span>JWT protected login</span></div>
          <div><Building2 size={17}/><span>Department-wise access</span></div>
          <div><Users size={17}/><span>Request and release workflow</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({email:"",password:""});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await login(form);
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/faculty/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthVisual/>
      <div className="auth-panel">
        <Link to="/" className="brand auth-brand">
          <span className="brand-mark"><Box size={20}/></span>
          Asset<span>Portal</span>
        </Link>

        <div className="auth-form-wrap">
          <h2>Welcome Back</h2>
          <p>Login to your AssetPortal account.</p>
          {error && <div className="alert error">{error}</div>}
          <form onSubmit={submit} className="form">
            <label>Email Address
              <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Enter your email"/>
            </label>
            <label>Password
              <div className="password-wrap">
                <input required type={show?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password"/>
                <button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button>
              </div>
            </label>
            <div className="form-row">
              <label className="check"><input type="checkbox"/> Remember me</label>
              <span className="linkish">Forgot Password?</span>
            </div>
            <button disabled={busy} className="btn btn-orange btn-block">{busy?"Signing in...":"Login"}</button>
          </form>
          <p className="auth-footer">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
