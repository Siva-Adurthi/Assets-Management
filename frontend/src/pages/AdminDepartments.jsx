import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import AppShell from "../components/AppShell";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { errorMessage, formatDate } from "../utils";

export default function AdminDepartments(){
  const [departments,setDepartments]=useState([]);
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState(null);
  const [error,setError]=useState("");

  const load=async()=>{try{setDepartments((await api.get("/departments")).data.departments)}catch(e){setError(errorMessage(e))}};
  useEffect(()=>{load()},[]);

  const remove=async d=>{if(!confirm(`Delete ${d.departmentName}?`))return;try{await api.delete(`/departments/${d._id}`);load()}catch(e){setError(errorMessage(e))}};

  return <AppShell admin>
    <PageTitle title="Manage Departments" subtitle="Add, update or delete departments." actions={<button className="btn btn-orange" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={17}/> Add Department</button>}/>
    {error&&<div className="alert error">{error}</div>}
    <div className="table-card"><div className="table-scroll"><table><thead><tr><th>Department Name</th><th>HOD Name</th><th>Asset ID</th><th>Allocation Date</th><th>Action</th></tr></thead><tbody>{departments.map(d=><tr key={d._id}><td><strong>{d.departmentName}</strong></td><td>{d.HODName}</td><td>{d.assetId||"—"}</td><td>{formatDate(d.allocationDate)}</td><td><div className="table-actions"><button className="icon-action" onClick={()=>{setEditing(d);setOpen(true)}}><Edit3 size={15}/></button><button className="icon-action danger" onClick={()=>remove(d)}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div></div>
    {open&&<DepartmentModal department={editing} onClose={()=>setOpen(false)} onSaved={()=>{setOpen(false);load()}}/>}
  </AppShell>
}

function DepartmentModal({department,onClose,onSaved}){
  const [form,setForm]=useState({departmentName:"",HODName:"",assetId:"",allocationDate:new Date().toISOString().slice(0,10)});
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  useEffect(()=>{if(department)setForm({departmentName:department.departmentName,HODName:department.HODName,assetId:department.assetId||"",allocationDate:department.allocationDate?.slice(0,10)||""})},[department]);
  const set=(k,v)=>setForm({...form,[k]:v});
  const submit=async e=>{e.preventDefault();setBusy(true);setError("");try{if(department)await api.put(`/departments/${department._id}`,form);else await api.post("/departments",form);onSaved()}catch(err){setError(errorMessage(err))}finally{setBusy(false)}};
  return <div className="modal-backdrop"><div className="modal compact"><div className="modal-head"><div><h2>{department?"Update Department":"Add Department"}</h2></div><button onClick={onClose}>×</button></div>{error&&<div className="alert error">{error}</div>}<form className="form" onSubmit={submit}><label>Department Name<input required value={form.departmentName} onChange={e=>set("departmentName",e.target.value)} placeholder="Computer Science and Engineering"/></label><label>HOD Name<input required value={form.HODName} onChange={e=>set("HODName",e.target.value)} placeholder="Dr. Kumar"/></label><label>Asset ID<input value={form.assetId} onChange={e=>set("assetId",e.target.value)} placeholder="AST001 (optional)"/></label><label>Allocation Date<input type="date" value={form.allocationDate} onChange={e=>set("allocationDate",e.target.value)}/></label><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button><button disabled={busy} className="btn btn-orange">{busy?"Saving...":department?"Update":"Add Department"}</button></div></form></div></div>
}
