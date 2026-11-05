// pages/SafetyTips.jsx
import { useState } from 'react';

const SECTIONS = {
  online: {
    label: 'Online',
    tips: [
      ['Video chat before meeting', 'A short call confirms they match their photos.'],
      ['Keep money off the app', 'Never send money, gift cards, or crypto to a match.'],
      ['Watch for love-bombing', 'Fast intensity + refusing video chat = red flags.'],
      ['Reverse-image search photos', 'Stolen photo sets are the top sign of a fake profile.'],
    ],
  },
  meeting: {
    label: 'Meeting IRL',
    tips: [
      ['First meet in public', 'Coffee, a bar, a munch — somewhere with other people.'],
      ['Tell a friend the plan', 'Share who, where, when, and a screenshot of their profile.'],
      ['Arrange your own transport', 'So you can leave on your own terms, any time.'],
      ['Set a check-in time', 'Text a friend by X; if you don\'t, they check on you.'],
    ],
  },
  kink: {
    label: 'Kink-specific',
    tips: [
      ['Negotiate sober and unhurried', 'Limits, safewords, aftercare — before, not mid-scene.'],
      ['Agree on a hard safeword', '"Red" stops everything, immediately, no exceptions.'],
      ['Vet for experience', 'Ask about training for rope, breath play, impact.'],
      ['Plan aftercare in advance', 'Decide who stays, who drives, and next-day check-ins.'],
    ],
  },
};

export default function SafetyTips() {
  const [active, setActive] = useState('online');
  return (
    <div className="safety-page">
      <h1>Safety & Consent</h1>
      <div className="tips-tabs">
        {Object.entries(SECTIONS).map(([key, s]) => (
          <button key={key}
            className={`ttab ${active===key?'active':''}`}
            onClick={() => setActive(key)}>{s.label}</button>
        ))}
      </div>
      <div className="tip-panel active">
        {SECTIONS[active].tips.map(([title, body], i) => (
          <div className="tip-item" key={title}>
            <div className="n">{String(i+1).padStart(2,'0')}</div>
            <div><b>{title}</b><span>{body}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}