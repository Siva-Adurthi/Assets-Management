import { useState } from "react";
import api from "../api";
import { errorMessage } from "../utils";
import { useAuth } from "../context/AuthContext";

export default function RequestAssetModal({ asset, onClose, onSaved }) {
  const { user } = useAuth();
  const [reason, setReason] = useState("Need this asset for project/department work");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/requests", { assetId: asset._id, reason });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return <div className="modal-backdrop"><div className="modal compact">
    <div className="modal-head">
      <div><h2>Request Asset</h2><p>Send this request to an administrator for approval.</p></div>
      <button onClick={onClose}>×</button>
    </div>

    <div className="request-asset-summary">
      <strong>{asset.assetName}</strong>
      <span>{asset.assetNumber} • {asset.assetCategory}</span>
      <span>Asset Department: {asset.department || "Unassigned"}</span>
      <span className="requester-department">Your Department: {user?.department || "Not Assigned"}</span>
    </div>

    {error && <div className="alert error">{error}</div>}

    <form className="form" onSubmit={submit}>
      <label>Reason<textarea required minLength={5} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why do you need this asset?"/></label>
      <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button><button disabled={busy} className="btn btn-orange">{busy?"Sending...":"Send Request"}</button></div>
    </form>
  </div></div>;
}
