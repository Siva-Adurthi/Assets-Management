import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { errorMessage, formatDate, getImageUrl } from "../utils";

export default function MyAssets(){
  const [requests,setRequests]=useState([]);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [busyId,setBusyId]=useState("");

  const load=async()=>{
    try{
      const rows=(await api.get("/requests/mine")).data.requests;
      setRequests(rows.filter(r => r.status === "Approved" && r.assetId?.assetStatus === "In Use" && r.assetId?.assignedTo));
    }catch(e){setError(errorMessage(e))}
  };
  useEffect(()=>{load()},[]);

  const release=async r=>{
    if(!confirm(`Release ${r.assetId?.assetName || "this asset"}?`))return;
    try{
      setBusyId(r._id);setError("");
      await api.put(`/requests/${r._id}/release`);
      setNotice("Asset released successfully. It is available again.");
      load();
    }catch(e){setError(errorMessage(e))}
    finally{setBusyId("")}
  };

  return <AppShell>
    <PageTitle title="My Assets" subtitle="Assets currently assigned to you. Release them when you finish using them."/>
    {error&&<div className="alert error">{error}</div>}
    {notice&&<div className="alert success">{notice}</div>}
    <div className="my-assets-grid">
      {requests.length ? requests.map(r=>{
        const imageUrl=getImageUrl(r.assetId.imageUrl);
        return <div className="my-asset-card" key={r._id}>
          <div className="my-asset-media">
            {imageUrl?<img src={imageUrl} alt={r.assetId.assetName}/>:<div className="image-placeholder">▣</div>}
            <StatusBadge value={r.assetId.assetStatus}/>
          </div>
          <div className="my-asset-body">
            <h3>{r.assetId.assetName}</h3>
            <p>{r.assetId.assetCategory} • {r.assetId.assetNumber}</p>
            <div className="my-asset-info"><span>Department</span><strong>{r.facultyDepartment}</strong><span>Assigned</span><strong>{formatDate(r.responseDate)}</strong></div>
            <button className="btn btn-orange btn-block" disabled={busyId===r._id} onClick={()=>release(r)}><RotateCcw size={16}/>{busyId===r._id?"Releasing...":"Release Asset"}</button>
          </div>
        </div>
      }):<div className="empty-state">No assets are currently assigned to you.</div>}
    </div>
  </AppShell>
}
