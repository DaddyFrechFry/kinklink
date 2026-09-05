import { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import {
  collection, getDocs, addDoc, query, where,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function SwipeDeck({ filters }) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'profiles'));
      const all = snap.docs
        .map((d) => d.data())
        .filter((p) => p.uid !== auth.currentUser.uid);

      const matchesFilter = (p) => {
        if (filters.requiredKinks.length &&
          !filters.requiredKinks.every((k) => p.kinks.includes(k))) return false;
        if (p.age < filters.minAge || p.age > filters.maxAge) return false;
        return true;
      };

      setProfiles(all.filter(matchesFilter));
    })();
  }, [filters]);

  const handleSwipe = async (direction, swipedProfile) => {
    await addDoc(collection(db, 'swipes'), {
      fromUid: auth.currentUser.uid,
      toUid: swipedProfile.uid,
      liked: direction === 'right',
      createdAt: Date.now(),
    });

    if (direction === 'right') {
      const q = query(
        collection(db, 'swipes'),
        where('fromUid', '==', swipedProfile.uid),
        where('toUid', '==', auth.currentUser.uid),
        where('liked', '==', true)
      );
      const theyLikedMe = await getDocs(q);
      if (!theyLikedMe.empty) {
        await addDoc(collection(db, 'matches'), {
          users: [auth.currentUser.uid, swipedProfile.uid],
          createdAt: Date.now(),
        });
      }
    }
  };

  return (
    <div className="deck">
      {profiles.map((p) => (
        <TinderCard key={p.uid} onSwipe={(dir) => handleSwipe(dir, p)}
          preventSwipe={['up', 'down']}>
          <div className="card" style={{ backgroundImage: `url(${p.photoURL})` }}>
            <div className="card-info">
              <h3>{p.displayName}, {p.age}</h3>
              <p>{p.bio}</p>
              <div className="tags">
                {p.kinks.map((k) => <span key={k}>{k}</span>)}
              </div>
            </div>
          </div>
        </TinderCard>
      ))}
      {profiles.length === 0 && <p className="empty">No more profiles match your filters.</p>}
    </div>
  );
}