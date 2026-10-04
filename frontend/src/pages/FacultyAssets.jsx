import { useEffect, useState } from "react";
import { Eye, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import RequestAssetModal from "../components/RequestAssetModal";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { CATEGORIES, STATUSES } from "../constants";
import { errorMessage } from "../utils";

export default function FacultyAssets() {
  const [assets,setAssets]=useState([]);
  const [q,setQ]=useState("");
  const [category,setCategory]=useState("");
  const [status,setStatus]=useState("");
  const [requestAsset,setRequestAsset]=useState(null);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");

  const load = async () => {
    try {
      const params={};
      if(q)params.search=q;
      if(category)params.category=category;
      if(status)params.status=status;
      const res=await api.get("/assets",{params});
      setAssets(res.data.assets);
    } catch(err){setError(errorMessage(err));}
  };

  useEffect(()=>{load()},[category,status]);

  return <AppShell>
    <PageTitle title="All Assets" subtitle="View assets and request an available asset from an administrator."/>
    {error&&<div className="alert error">{error}</div>}
    {notice&&<div className="alert success">{notice}</div>}
    <div className="filter-bar">
      <div className="search-input"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()} placeholder="Search by asset name, category, department..."/></div>
      <select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All Categories</option>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select>
      <select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All Status</option>{STATUSES.map(x=><option key={x}>{x}</option>)}</select>
      <button className="btn btn-orange" onClick={load}><Filter size={16}/> Filter</button>
    </div>
    <div className="table-card"><div className="table-scroll"><table><thead><tr><th>Asset Name</th><th>Category</th><th>Status</th><th>Department</th><th>Condition</th><th>Action</th></tr></thead>
      <tbody>{assets.length?assets.map(a=><tr key={a._id}><td><strong>{a.assetName}</strong></td><td>{a.assetCategory}</td><td><StatusBadge value={a.assetStatus}/></td><td>{a.department}</td><td>{a.assetCondition}</td><td><div className="table-actions"><Link className="icon-action" to={`/faculty/assets/${a._id}`} title="View details"><Eye size={16}/></Link>{a.assetStatus==="Available"&&<button className="request-button" onClick={()=>setRequestAsset(a)}>Request</button>}</div></td></tr>):<tr><td colSpan="6" className="empty">No assets found.</td></tr>}</tbody>
    </table></div></div>
    {requestAsset&&<RequestAssetModal asset={requestAsset} onClose={()=>setRequestAsset(null)} onSaved={()=>{setRequestAsset(null);setNotice("Asset request submitted. Wait for admin approval.");}}/>}
  </AppShell>
}
