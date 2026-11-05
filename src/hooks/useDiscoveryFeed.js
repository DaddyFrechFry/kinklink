// hooks/useDiscoveryFeed.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export async function getDiscoveryFeed(currentUserId) {
  // 1. My outgoing blocks
  const myBlocksSnap = await getDocs(collection(db, 'users', currentUserId, 'blocks'));
  const myBlockedIds = myBlocksSnap.docs.map(d => d.id);

  // 2. People who blocked ME (mirror collection kept in sync by a Cloud Function)
  const blockedBySnap = await getDocs(collection(db, 'users', currentUserId, 'blockedBy'));
  const blockedByIds = blockedBySnap.docs.map(d => d.id);

  const excluded = new Set([...myBlockedIds, ...blockedByIds, currentUserId]);

  const candidatesSnap = await getDocs(
    query(collection(db, 'users'), where('guidelinesAcceptedAt', '!=', null))
  );

  return candidatesSnap.docs
    .filter(d => !excluded.has(d.id))
    .map(d => ({ id: d.id, ...d.data() }));
}