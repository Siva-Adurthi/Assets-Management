import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Building2, Eye, EyeOff, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../utils";
import api from "../api";

function AuthVisual({ mode }) {
  const register = mode === "register";
  return (
    <div className="auth-image">
      <div className="auth-orb orb-one"/>
      <div className="auth-orb orb-two"/>
      <div className="auth-visual-content">
        <div className="auth-visual-badge"><Box size={24}/> <span>Asset<span>Portal</span></span></div>
        <span className="eyebrow">SMART CAMPUS • SECURE ACCESS</span>
        <h1>{register ? "Join your department workspace." : "Manage department assets with confidence."}</h1>
        <p>{register
          ? "Create your faculty account and get a clear view of the assets available to your department."
          : "A clean, secure workspace for faculty and administrators to track, request and manage campus assets."}</p>
        <div className="auth-feature-stack">
          <div><ShieldCheck size={17}/><span>Role-based access</span></div>
          <div><Building2 size={17}/><span>Department-wise assets</span></div>
          <div><Users size={17}/><span>Request and release workflow</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name:"", email:"", department:"", password:"", confirmPassword:"" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/departments/public")
      .then(res => setDepartments(res.data.departments))
      .catch(() => setDepartments([]));
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/faculty/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthVisual mode="register"/>
      <div className="auth-panel">
        <Link to="/" className="brand auth-brand">
          <span className="brand-mark"><Box size={20}/></span>
          Asset<span>Portal</span>
        </Link>

        <div className="auth-form-wrap">
          <h2>Create Faculty Account</h2>
          <p>Register to access the Department Asset Portal.</p>
          {error && <div className="alert error">{error}</div>}
          {departments.length === 0 && (
            <div className="alert warning">No departments are available yet. Ask an admin to create a department first.</div>
          )}
          <form onSubmit={submit} className="form">
            <label>Full Name
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter your full name"/>
            </label>
            <label>Email Address
              <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Enter your email"/>
            </label>
            <label>Department
              <select required value={form.department} onChange={e=>setForm({...form,department:e.target.value})} disabled={!departments.length}>
                <option value="">Select your department</option>
                {departments.map(d=><option key={d._id} value={d.departmentName}>{d.departmentName}</option>)}
              </select>
            </label>
            <label>Password
              <div className="password-wrap">
                <input required minLength="6" type={show?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter password"/>
                <button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button>
              </div>
            </label>
            <label>Confirm Password
              <input required type="password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} placeholder="Confirm password"/>
            </label>
            <button disabled={busy || !departments.length} className="btn btn-orange btn-block">{busy?"Creating...":"Register"}</button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
