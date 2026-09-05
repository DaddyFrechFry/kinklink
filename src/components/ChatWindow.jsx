import { useEffect, useState } from 'react';
import {
  collection, addDoc, query, orderBy, onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function ChatWindow({ matchId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'matches', matchId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [matchId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'matches', matchId, 'messages'), {
      senderUid: auth.currentUser.uid,
      text: text.trim(),
      createdAt: Date.now(),
    });
    setText('');
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id}
            className={m.senderUid === auth.currentUser.uid ? 'msg mine' : 'msg theirs'}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="composer">
        <input value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message…" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}