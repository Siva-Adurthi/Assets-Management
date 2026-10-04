import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { errorMessage, formatDate, getImageUrl } from "../utils";

export default function MyRequests(){
  const [requests,setRequests]=useState([]);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [busyId,setBusyId]=useState("");

  const load=async()=>{
    try{setRequests((await api.get("/requests/mine")).data.requests)}
    catch(e){setError(errorMessage(e))}
  };
  useEffect(()=>{load()},[]);

  const cancel=async r=>{
    try{setError("");await api.put(`/requests/${r._id}/cancel`);setNotice("Request cancelled.");load()}
    catch(e){setError(errorMessage(e))}
  };

  const release=async r=>{
    if(!confirm(`Release ${r.assetId?.assetName || "this asset"}?`)) return;
    try{
      setBusyId(r._id);setError("");
      await api.put(`/requests/${r._id}/release`);
      setNotice("Asset released successfully. It is available again.");
      load();
    }catch(e){setError(errorMessage(e))}
    finally{setBusyId("")}
  };

  return <AppShell>
    <PageTitle title="My Requests" subtitle="Track your requests and release approved assets when you finish using them."/>
    {error&&<div className="alert error">{error}</div>}
    {notice&&<div className="alert success">{notice}</div>}

    <div className="request-grid">
      {requests.length ? requests.map(r => {
        const imageUrl = getImageUrl(r.assetId?.imageUrl);
        const canRelease = r.status === "Approved" && r.assetId?.assetStatus === "In Use" && r.assetId?.assignedTo;

        return <div className={`request-card ${canRelease ? "active-assignment" : ""}`} key={r._id}>
          <div className="request-card-top">
            {imageUrl ? <img className="request-thumb" src={imageUrl} alt={r.assetId?.assetName || "Asset"}/> : <div className="request-thumb placeholder">▣</div>}
            <div className="request-card-head"><div><strong>{r.assetId?.assetName || "Deleted Asset"}</strong><span>{r.requestId}</span></div><StatusBadge value={r.status}/></div>
          </div>

          <div className="request-meta">
            <span>Your Department</span><strong>{r.facultyDepartment || r.facultyId?.department || "-"}</strong>
            <span>Asset Department</span><strong>{r.assetId?.department || "Unassigned"}</strong>
            <span>Asset Number</span><strong>{r.assetId?.assetNumber || "-"}</strong>
            <span>Requested</span><strong>{formatDate(r.requestDate)}</strong>
            {r.responseDate && <><span>Responded</span><strong>{formatDate(r.responseDate)}</strong></>}
            {r.releasedAt && <><span>Released</span><strong>{formatDate(r.releasedAt)}</strong></>}
            <span>Reason</span><p>{r.reason}</p>
          </div>

          {r.adminRemark&&<div className="admin-remark"><span>Admin remark</span><p>{r.adminRemark}</p></div>}

          <div className="request-actions">
            {r.status==="Pending"&&<button className="btn btn-outline" onClick={()=>cancel(r)}>Cancel Request</button>}
            {canRelease&&<button className="btn btn-orange" disabled={busyId===r._id} onClick={()=>release(r)}><RotateCcw size={16}/>{busyId===r._id?"Releasing...":"Release Asset"}</button>}
          </div>
        </div>
      }) : <div className="empty-state">You have not submitted any asset requests yet.</div>}
    </div>
  </AppShell>
}
