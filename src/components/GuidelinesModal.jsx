// components/GuidelinesModal.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const RULES = [
  { icon: '🤝', title: 'Consent is non-negotiable',
    body: 'All interactions require explicit, ongoing, revocable consent. Pressuring or ignoring a "no" is an instant ban.' },
  { icon: '🚫', title: 'No explicit content',
    body: 'Photos, bios, and messages must stay non-explicit. This is a matchmaking app, not a content platform.' },
  { icon: '🛡️', title: 'Respect, always',
    body: 'Harassment, outing, kink-shaming, or fake profiles are reportable and enforced.' },
  { icon: '📍', title: 'Meet safely',
    body: 'Video-verify, meet publicly first, share your plans — see Safety Tips any time from Settings.' },
];

export function GuidelinesModal({ userId, onAccepted }) {
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const snap = await getDoc(doc(db, 'users', userId));
      const acceptedAt = snap.data()?.guidelinesAcceptedAt;
      setOpen(!acceptedAt);
      setLoading(false);
    })();
  }, [userId]);

  async function accept() {
    await setDoc(doc(db, 'users', userId), {
      guidelinesAcceptedAt: serverTimestamp(),
      guidelinesVersion: '2024-06', // bump when copy changes to force re-accept
    }, { merge: true });
    setOpen(false);
    onAccepted?.();
  }

  if (loading || !open) return null;

  return (
    <div className="overlay open" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>Before you join</h3>
        <p className="sub">Four rules that keep this community consensual and safe.</p>
        {RULES.map(r => (
          <div className="rule" key={r.title}>
            <div className="ic">{r.icon}</div>
            <div><b>{r.title}</b><span>{r.body}</span></div>
          </div>
        ))}
        <label className="modal-check">
          <input type="checkbox" checked={checked}
            onChange={e => setChecked(e.target.checked)} />
          <span>I have read and agree to follow these community guidelines.</span>
        </label>
        <button
          className={`modal-cta ${checked ? 'ready' : ''}`}
          disabled={!checked}
          onClick={accept}>
          Enter the app
        </button>
      </div>
    </div>
  );
}