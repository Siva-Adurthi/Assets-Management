import { useEffect, useRef, useState } from "react";
import api from "../api";
import { CATEGORIES, CONDITIONS, STATUSES } from "../constants";
import { errorMessage } from "../utils";

const blank = {
  assetName:"",assetCategory:"Computers",assetNumber:"",purchaseDate:"",
  department:"Unassigned",assetCondition:"Good",assetStatus:"Available",description:""
};

export default function AssetFormModal({asset,onClose,onSaved}){
  const [form,setForm]=useState(blank);
  const [departments,setDepartments]=useState([]);
  const [image,setImage]=useState(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const fileRef=useRef(null);

  useEffect(()=>{
    if(asset)setForm({
      assetName:asset.assetName||"",assetCategory:asset.assetCategory||"Computers",
      assetNumber:asset.assetNumber||"",purchaseDate:asset.purchaseDate?asset.purchaseDate.slice(0,10):"",
      department:asset.department||"Unassigned",assetCondition:asset.assetCondition||"Good",
      assetStatus:asset.assetStatus||"Available",description:asset.description||""
    });
    else setForm(blank);
    setImage(null);
    api.get("/departments").then(r=>setDepartments(r.data.departments)).catch(()=>{});
  },[asset]);

  const set=(k,v)=>setForm({...form,[k]:v});

  const submit=async e=>{
    e.preventDefault();setError("");setBusy(true);
    try{
      const body=new FormData();
      Object.entries(form).forEach(([k,v])=>body.append(k,v));
      if(image) body.append("image",image);
      if(asset) await api.put(`/assets/${asset._id}`,body,{headers:{"Content-Type":"multipart/form-data"}});
      else await api.post("/assets",body,{headers:{"Content-Type":"multipart/form-data"}});
      onSaved();
    }catch(err){setError(errorMessage(err))}finally{setBusy(false)}
  };

  return <div className="modal-backdrop"><div className="modal">
    <div className="modal-head"><div><h2>{asset?"Update Asset":"Add New Asset"}</h2><p>Enter the asset details. Image upload is optional.</p></div><button onClick={onClose}>×</button></div>
    {error&&<div className="alert error">{error}</div>}
    <form onSubmit={submit} className="form form-grid">
      <label>Asset Name<input required value={form.assetName} onChange={e=>set("assetName",e.target.value)} placeholder="Dell Laptop"/></label>
      <label>Category<select value={form.assetCategory} onChange={e=>set("assetCategory",e.target.value)}>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Asset Number<input required value={form.assetNumber} onChange={e=>set("assetNumber",e.target.value)} placeholder="DL-2025-001"/></label>
      <label>Purchase Date<input required type="date" value={form.purchaseDate} onChange={e=>set("purchaseDate",e.target.value)}/></label>
      <label>Department<select value={form.department} onChange={e=>set("department",e.target.value)}><option>Unassigned</option>{departments.map(d=><option key={d._id}>{d.departmentName}</option>)}</select></label>
      <label>Asset Condition<select value={form.assetCondition} onChange={e=>set("assetCondition",e.target.value)}>{CONDITIONS.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Status<select value={form.assetStatus} onChange={e=>set("assetStatus",e.target.value)}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Asset Image <span className="optional-label">(optional)</span><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>setImage(e.target.files?.[0]||null)}/><small className="form-help">JPG, PNG, WEBP or GIF • max 5 MB</small></label>
      <label className="full">Description<textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Enter asset description"/></label>
      <div className="modal-actions full"><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button><button disabled={busy} className="btn btn-orange">{busy?"Saving...":asset?"Update Asset":"Add Asset"}</button></div>
    </form>
  </div></div>
}
