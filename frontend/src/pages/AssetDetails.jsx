import { useEffect, useState } from "react";
import { ArrowLeft, Box, ImageOff } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import RequestAssetModal from "../components/RequestAssetModal";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { errorMessage, formatDate, getImageUrl } from "../utils";
import { useAuth } from "../context/AuthContext";

export default function AssetDetails() {
  const {id}=useParams();
  const {user}=useAuth();
  const [asset,setAsset]=useState(null);
  const [requestOpen,setRequestOpen]=useState(false);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{api.get(`/assets/${id}`).then(r=>setAsset(r.data)).catch(err=>setError(errorMessage(err)))},[id]);

  if(error)return <AppShell><div className="alert error">{error}</div></AppShell>;
  if(!asset)return <AppShell><div className="loading-screen small">Loading asset...</div></AppShell>;

  const imageUrl=getImageUrl(asset.imageUrl);

  return <AppShell>
    <Link to="/faculty/assets" className="back-link"><ArrowLeft size={16}/> Back to Assets</Link>
    <PageTitle title="Asset Details" subtitle="Complete information about this department asset."/>
    {notice&&<div className="alert success">{notice}</div>}
    <div className="detail-card">
      <div className="asset-preview">{imageUrl?<img src={imageUrl} alt={asset.assetName}/>:<><Box size={70}/><ImageOff size={18}/><span>No image uploaded</span></>}</div>
      <div className="detail-main">
        <div className="detail-heading"><div><h2>{asset.assetName}</h2><span className="muted">{asset.assetNumber}</span></div><StatusBadge value={asset.assetStatus}/></div>
        <div className="detail-grid">
          <Info label="Asset ID" value={asset.assetId}/><Info label="Category" value={asset.assetCategory}/><Info label="Asset Number" value={asset.assetNumber}/><Info label="Purchase Date" value={formatDate(asset.purchaseDate)}/><Info label="Condition" value={asset.assetCondition}/><Info label="Department" value={asset.department}/><Info label="Status" value={asset.assetStatus}/><Info label="Assigned To" value={asset.assignedTo?.name || "Not assigned"}/>
        </div>
        <div className="description"><span>Description</span><p>{asset.description || "No description provided."}</p></div>
        {user?.role==="faculty" && asset.assetStatus==="Available" && <button className="btn btn-orange request-detail-btn" onClick={()=>setRequestOpen(true)}>Request This Asset</button>}
      </div>
    </div>
    {requestOpen&&<RequestAssetModal asset={asset} onClose={()=>setRequestOpen(false)} onSaved={()=>{setRequestOpen(false);setNotice("Asset request submitted. Wait for admin approval.")}}/>}
  </AppShell>
}

function Info({label,value}){return <div className="info-item"><span>{label}</span><strong>{value || "-"}</strong></div>}
