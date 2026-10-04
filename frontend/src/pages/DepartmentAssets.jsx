import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { PageTitle } from "./FacultyDashboard";
import StatusBadge from "../components/StatusBadge";
import api from "../api";
import { errorMessage, formatDate } from "../utils";

export default function DepartmentAssets() {
  const [departments,setDepartments]=useState([]);
  const [department,setDepartment]=useState("");
  const [assets,setAssets]=useState([]);
  const [error,setError]=useState("");

  useEffect(()=>{api.get("/departments").then(r=>{
    setDepartments(r.data.departments);
    if(r.data.departments[0]) setDepartment(r.data.departments[0].departmentName);
  }).catch(err=>setError(errorMessage(err)))},[]);

  useEffect(()=>{
    if(!department)return;
    api.get("/assets",{params:{department}}).then(r=>setAssets(r.data.assets)).catch(err=>setError(errorMessage(err)));
  },[department]);

  return <AppShell>
    <PageTitle title={`${department || "Department"} Assets`} subtitle="Assets allocated to the selected department."/>
    {error&&<div className="alert error">{error}</div>}
    <div className="select-row"><label>Select Department<select value={department} onChange={e=>setDepartment(e.target.value)}>{departments.map(d=><option key={d._id}>{d.departmentName}</option>)}</select></label></div>
    <div className="table-card"><div className="table-scroll"><table><thead><tr><th>Asset Name</th><th>Category</th><th>Status</th><th>Asset Number</th><th>Allocation Date</th></tr></thead><tbody>{assets.map(a=><tr key={a._id}><td><strong>{a.assetName}</strong></td><td>{a.assetCategory}</td><td><StatusBadge value={a.assetStatus}/></td><td>{a.assetNumber}</td><td>{formatDate(a.updatedAt)}</td></tr>)}</tbody></table></div></div>
  </AppShell>
}
