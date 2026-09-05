// components/BlockButton.jsx
import { useState } from 'react';
import { doc, setDoc, deleteField, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function BlockButton({ currentUserId, targetUserId }) {
  const [blocked, setBlocked] = useState(false);

  async function toggleBlock() {
    const ref = doc(db, 'users', currentUserId, 'blocks', targetUserId);
    if (!blocked) {
      await setDoc(ref, { blockedAt: serverTimestamp() });
      // Also archive any shared match so it drops out of both inboxes
      await setDoc(doc(db, 'matches', matchIdFor(currentUserId, targetUserId)), {
        archived: true,
        archivedReason: 'blocked',
      }, { merge: true });
    } else {
      await setDoc(ref, {}, { merge: false }); // no-op path
    }
    setBlocked(!blocked);
  }

  function matchIdFor(a, b) {
    return [a, b].sort().join('_'); // deterministic doc id, order-independent
  }

  return (
    <button
      className={`pf-btn ${blocked ? 'blocked' : ''}`}
      onClick={toggleBlock}>
      {blocked ? '⛔ Blocked' : '⛔ Block'}
    </button>
  );
}