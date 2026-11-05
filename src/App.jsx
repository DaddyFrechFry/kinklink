import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import './App.css'
import { GuidelinesModal } from './components/GuidelinesModal';
import AuthScreen from './components/AuthScreen';
import ProfileSetup from './components/ProfileSetup';
import SwipeDeck from './components/SwipeDeck';
import SafetyTips from './pages/SafetyTips';
import ModerationDashboard from './pages/admin/ModerationDashboard';
import { useAuth } from './hooks/useAuth';

const DEFAULT_FILTERS = { requiredKinks: [], minAge: 18, maxAge: 99 };

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading…</p>;

  return (
    <BrowserRouter>
      {user && <GuidelinesModal userId={user.uid} />}
      <AppRouter user={user} />
    </BrowserRouter>
  );
}

function AppRouter({ user }) {
  if (!user) {
    return (
      <Routes>
        <Route path="/safety" element={<SafetyTips />} />
        <Route path="*" element={<AuthScreen />} />
      </Routes>
    );
  }

  return (
    <>
      <nav>
        <Link to="/">Discover</Link> · <Link to="/profile">Profile</Link> ·{' '}
        <Link to="/safety">Safety</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SwipeDeck filters={DEFAULT_FILTERS} />} />
        <Route path="/profile" element={<ProfileRoute />} />
        <Route path="/safety" element={<SafetyTips />} />
        <Route path="/admin" element={<ModerationDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function ProfileRoute() {
  const navigate = useNavigate();
  return <ProfileSetup onDone={() => navigate('/')} />;
}
