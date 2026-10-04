import { useEffect, useState } from "react";
import { Check, XCircle } from "lucide-react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { errorMessage, formatDate } from "../utils";

export default function AdminRequests(){
  const [status,setStatus]=useState("Pending");
  const [requests,setRequests]=useState([]);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [remarks,setRemarks]=useState({});

  const load=async()=>{
    try{const r=await api.get("/requests",{params:{status}});setRequests(r.data.requests)}
    catch(e){setError(errorMessage(e))}
  };
  useEffect(()=>{load()},[status]);

  const respond=async(r,action)=>{
    try{
      setError("");
      if(action==="approve") await api.put(`/requests/${r._id}/approve`,{adminRemark:remarks[r._id]||""});
      else await api.put(`/requests/${r._id}/reject`,{adminRemark:remarks[r._id]||""});
      setNotice(action==="approve"?"Request approved and asset assigned.":"Request rejected.");
      load();
    }catch(e){setError(errorMessage(e))}
  };

  return <AppShell admin>
    <PageTitle title="Asset Requests" subtitle="Review faculty requests, verify their department and approve or reject them."/>
    {error&&<div className="alert error">{error}</div>}{notice&&<div className="alert success">{notice}</div>}
    <div className="request-toolbar"><select value={status} onChange={e=>setStatus(e.target.value)}><option>Pending</option><option>Approved</option><option>Rejected</option><option>Cancelled</option><option>Released</option><option>All</option></select><span>{requests.length} request(s)</span></div>
    <div className="request-admin-list">{requests.length?requests.map(r=><div className="admin-request-card" key={r._id}>
      <div className="admin-request-main"><div className="request-avatar">{r.facultyId?.name?.charAt(0)||"F"}</div><div><h3>{r.facultyId?.name||"Unknown Faculty"}</h3><p>{r.facultyId?.email||"-"}</p><span className="muted">{r.requestId} • {formatDate(r.requestDate)}</span></div><div className="admin-request-status"><StatusBadge value={r.status}/></div></div>
      <div className="request-detail-row five">
        <div><span>Faculty Department</span><strong>{r.facultyDepartment || r.facultyId?.department || "Not Assigned"}</strong></div>
        <div><span>Asset</span><strong>{r.assetId?.assetName||"Deleted Asset"}</strong></div>
        <div><span>Asset Number</span><strong>{r.assetId?.assetNumber||"-"}</strong></div>
        <div><span>Category</span><strong>{r.assetId?.assetCategory||"-"}</strong></div>
        <div><span>Asset Department</span><strong>{r.assetId?.department||"Unassigned"}</strong></div>
      </div>
      <div className="request-status-line"><span>Current Asset Status</span><StatusBadge value={r.assetId?.assetStatus||"-"}/></div>
      <div className="request-reason"><span>Reason</span><p>{r.reason}</p></div>
      {r.status==="Pending"?<div className="admin-response"><textarea value={remarks[r._id]||""} onChange={e=>setRemarks({...remarks,[r._id]:e.target.value})} placeholder="Optional admin remark"/><div><button className="btn btn-outline danger-btn" onClick={()=>respond(r,"reject")}><XCircle size={16}/> Reject</button><button className="btn btn-orange" onClick={()=>respond(r,"approve")}><Check size={16}/> Accept & Assign</button></div></div>:<div className="request-history">{r.approvedBy&&<span>Handled by: <strong>{r.approvedBy.name}</strong></span>}{r.responseDate&&<span>Response date: <strong>{formatDate(r.responseDate)}</strong></span>}{r.releasedAt&&<span>Released: <strong>{formatDate(r.releasedAt)}</strong></span>}{r.adminRemark&&<div className="admin-remark"><span>Admin remark</span><p>{r.adminRemark}</p></div>}</div>}
    </div>):<div className="empty-state">No requests in this status.</div>}</div>
  </AppShell>
}
