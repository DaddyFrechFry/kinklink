import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const KINK_TAGS = [
  'Rope', 'Impact', 'D/s', 'Switch', 'Sadist', 'Masochist',
  'Service', 'Exhibitionist', 'Voyeur', 'Pet Play', 'Age Play',
  'Latex', 'Leather', 'Sensory', 'Praise', 'Degradation',
];

export default function ProfileSetup({ onDone }) {
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [photoURL, setPhotoURL] = useState('');

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleSave = async () => {
    await setDoc(doc(db, 'profiles', auth.currentUser.uid), {
      uid: auth.currentUser.uid,
      displayName,
      age: Number(age),
      bio,
      kinks: selectedTags,
      photoURL,
      visible: true,
      createdAt: Date.now(),
    });
    onDone();
  };

  return (
    <div className="profile-setup">
      <h2>Build your profile</h2>
      <input placeholder="Display name" value={displayName}
        onChange={(e) => setDisplayName(e.target.value)} />
      <input type="number" placeholder="Age" min="18" value={age}
        onChange={(e) => setAge(e.target.value)} />
      <textarea placeholder="Bio / what you're into" value={bio}
        onChange={(e) => setBio(e.target.value)} />
      <input placeholder="Photo URL" value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)} />

      <div className="tag-grid">
        {KINK_TAGS.map((tag) => (
          <button key={tag} type="button"
            className={selectedTags.includes(tag) ? 'tag active' : 'tag'}
            onClick={() => toggleTag(tag)}>
            {tag}
          </button>
        ))}
      </div>

      <button onClick={handleSave} className="primary">Save & start swiping</button>
    </div>
  );
}