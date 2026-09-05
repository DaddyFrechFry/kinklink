// components/ReportButton.jsx
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const REASONS = [
  { v: 'inappropriate_content', label: '📵 Inappropriate / explicit content' },
  { v: 'harassment', label: '⚠️ Harassment or non-consensual behavior' },
  { v: 'fake_profile', label: '🎭 Fake profile or catfishing' },
  { v: 'other', label: '✏️ Other' },
];

export function ReportButton({ reporterId, reportedUserId, context }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!reason) return;
    setSending(true);
    await addDoc(collection(db, 'reports'), {
      reporterId,
      reportedUserId,
      reason,
      note: note.slice(0, 300),
      context, // e.g. 'profile' | 'chat' | 'photo'
      status: 'open',       // open | reviewing | resolved | dismissed
      severity: reason === 'harassment' ? 'high' : 'medium',
      createdAt: serverTimestamp(),
    });
    setSending(false);
    setSent(true);
  }

  return (
    <>
      <button className="pf-btn" onClick={() => setOpen(true)}>🚩 Report</button>
      {open && (
        <div className="report-panel">
          {!sent ? (
            <>
              <h4>Why are you reporting this profile?</h4>
              {REASONS.map(r => (
                <button key={r.v}
                  className={`ropt ${reason===r.v?'selected':''}`}
                  onClick={() => setReason(r.v)}>{r.label}</button>
              ))}
              {reason === 'other' && (
                <textarea maxLength={300} value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Tell us what happened..." />
              )}
              <button className="rsubmit" disabled={!reason || sending}
                onClick={submit}>
                {sending ? 'Sending…' : 'Submit report'}
              </button>
            </>
          ) : (
            <div className="report-success show">
              ✅ <b>Report received.</b> Reviewed within 24h. Anonymous to the reported user.
            </div>
          )}
        </div>
      )}
    </>
  );
}