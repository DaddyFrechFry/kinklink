// hooks/useAdminGuard.js
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export function useAdminGuard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    return auth.onAuthStateChanged(async user => {
      if (!user) { setIsAdmin(false); setChecking(false); return; }
      const token = await user.getIdTokenResult();
      setIsAdmin(Boolean(token.claims.admin));
      setChecking(false);
    });
  }, []);

  return { isAdmin, checking };
}

// Set the claim server-side once, e.g. via a one-time admin script:
// admin.auth().setCustomUserClaims(uid, { admin: true });
// Never set this claim from client code.