import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function ReportBlock({ targetUid, onBlocked }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('Harassment');

  const submitReport = async () => {
    await addDoc(collection(db, 'reports'), {
      reporterUid: auth.currentUser.uid,
      reportedUid: targetUid,
      reason,
      createdAt: Date.now(),
    });
    setOpen(false);
  };

  const blockUser = async () => {
    await addDoc(collection(db, 'blocks'), {
      blockerUid: auth.currentUser.uid,
      blockedUid: targetUid,
      createdAt: Date.now(),
    });
    onBlocked(targetUid);
  };

  return (
    <div className="report-block">
      <button className="link-btn danger" onClick={() => setOpen(!open)}>⚑ Report</button>
      <button className="link-btn danger" onClick={blockUser}>🚫 Block</button>
      {open && (
        <div className="report-form">
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option>Harassment</option>
            <option>Fake profile</option>
            <option>Non-consensual content</option>
            <option>Underage suspicion</option>
            <option>Other</option>
          </select>
          <button onClick={submitReport}>Submit report</button>
        </div>
      )}
    </div>
  );
}