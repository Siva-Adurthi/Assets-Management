import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AppShell from "../components/AppShell";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { errorMessage } from "../utils";

export default function AdminUsers(){
  const [users,setUsers]=useState([]);
  const [departments,setDepartments]=useState([]);
  const [open,setOpen]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");

  const load=async()=>{
    try{
      const [u,d]=await Promise.all([api.get("/users"),api.get("/departments")]);
      setUsers(u.data.users);setDepartments(d.data.departments);
    }catch(e){setError(errorMessage(e))}
  };
  useEffect(()=>{load()},[]);

  const update=async(user,field,value)=>{
    try{
      setError("");
      await api.patch(`/users/${user._id}`,{[field]:value, ...(field==="role" && value==="admin" ? {department:""} : {})});
      setNotice(`${user.name}'s ${field} was updated.`);
      load();
    }catch(e){setError(errorMessage(e))}
  };

  return <AppShell admin>
    <PageTitle title="Users & Admin Access" subtitle="Create administrators, faculty accounts and manage faculty departments." actions={<button className="btn btn-orange" onClick={()=>setOpen(true)}><Plus size={17}/> Add User</button>}/>
    {error&&<div className="alert error">{error}</div>}{notice&&<div className="alert success">{notice}</div>}
    <div className="table-card"><div className="table-scroll"><table><thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Change Role</th><th>Change Department</th></tr></thead><tbody>{users.map(u=><tr key={u._id}>
      <td>{u.userId}</td><td><strong>{u.name}</strong></td><td>{u.email}</td><td><span className={`role-pill ${u.role}`}>{u.role}</span></td>
      <td>{u.role==="faculty"?u.department||"Not Assigned":"—"}</td>
      <td><select value={u.role} onChange={e=>update(u,"role",e.target.value)}><option value="admin">Admin</option><option value="faculty">Faculty</option></select></td>
      <td>{u.role==="faculty"?<select value={u.department||""} onChange={e=>update(u,"department",e.target.value)}><option value="">Select department</option>{departments.map(d=><option key={d._id}>{d.departmentName}</option>)}</select>:<span className="muted">Admin account</span>}</td>
    </tr>)}</tbody></table></div></div>
    {open&&<AddUserModal departments={departments} onClose={()=>setOpen(false)} onSaved={()=>{setOpen(false);setNotice("User created successfully.");load()}}/>}
  </AppShell>
}

function AddUserModal({departments,onClose,onSaved}){
  const [form,setForm]=useState({name:"",email:"",password:"",role:"admin",department:""}); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const set=(k,v)=>setForm({...form,[k]:v});
  const submit=async e=>{e.preventDefault();setError("");setBusy(true);try{await api.post("/users",form);onSaved()}catch(err){setError(errorMessage(err))}finally{setBusy(false)}};
  return <div className="modal-backdrop"><div className="modal compact"><div className="modal-head"><div><h2>Add User</h2><p>Create another administrator or a faculty account.</p></div><button onClick={onClose}>×</button></div>{error&&<div className="alert error">{error}</div>}<form className="form" onSubmit={submit}><label>Full Name<input required value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Full name"/></label><label>Email<input required type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="email@college.com"/></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Minimum 6 characters"/></label><label>Role<select value={form.role} onChange={e=>set("role",e.target.value)}><option value="admin">Admin</option><option value="faculty">Faculty</option></select></label>{form.role==="faculty"&&<label>Department<select required value={form.department} onChange={e=>set("department",e.target.value)}><option value="">Select department</option>{departments.map(d=><option key={d._id}>{d.departmentName}</option>)}</select></label>}<div className="modal-actions"><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button><button disabled={busy} className="btn btn-orange">{busy?"Creating...":"Create User"}</button></div></form></div></div>
}
