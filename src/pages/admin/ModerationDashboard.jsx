// pages/admin/ModerationDashboard.jsx
import { useEffect, useState } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  doc, updateDoc, deleteDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAdminGuard } from '../../hooks/useAdminGuard';

export default function ModerationDashboard() {
  const { isAdmin, checking } = useAdminGuard(); // redirects non-admins
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(
      collection(db, 'reports'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, snap =>
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, [isAdmin]);

  async function resolve(reportId, action) {
    await updateDoc(doc(db, 'reports', reportId), {
      status: 'resolved',
      action,
      resolvedAt: serverTimestamp(),
    });
  }

  async function suspendUser(userId, reportId) {
    await setDoc(doc(db, 'users', userId), {
      status: 'suspended',
      suspendedAt: serverTimestamp(),
    }, { merge: true });
    await resolve(reportId, 'suspend');
  }

  async function banUser(userId, reportId) {
    await setDoc(doc(db, 'users', userId), {
      status: 'banned',
      bannedAt: serverTimestamp(),
    }, { merge: true });
    await resolve(reportId, 'ban');
  }

  async function removeContent(userId, photoId, reportId) {
    await deleteDoc(doc(db, 'users', userId, 'photos', photoId));
    await resolve(reportId, 'remove_content');
  }

  if (checking) return <p>Checking admin access…</p>;
  if (!isAdmin) return <p>403 — Admins only.</p>;

  return (
    <table className="mod-table">
      <thead><tr><th>Reported</th><th>Reason</th><th>Severity</th><th>Actions</th></tr></thead>
      <tbody>
        {reports.map(r => (
          <tr key={r.id}>
            <td>{r.reportedUserId}</td>
            <td>{r.reason}</td>
            <td><span className={`sev ${r.severity}`}>{r.severity}</span></td>
            <td>
              <button onClick={() => resolve(r.id, 'dismiss')}>Dismiss</button>
              <button onClick={() => suspendUser(r.reportedUserId, r.id)}>Suspend</button>
              <button onClick={() => banUser(r.reportedUserId, r.id)}>Ban</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}