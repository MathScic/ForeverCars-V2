import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Profile } from "../../../shared/model";
import { errorText } from "../data/store";
import LiveStoreProvider from "./LiveStoreProvider";
import Login from "./Login";
import Splash from "./Splash";

// Mode réel : session déjà ouverte sur ce PC → le parc ; sinon l'écran de connexion.
export default function AuthGate({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    window.api.auth.session().then(
      (p) => alive && setProfile(p),
      (e: unknown) => alive && setError(errorText(e)),
    );
    return () => {
      alive = false;
    };
  }, [attempt]);
  const check = () => {
    setError(null);
    setAttempt((n) => n + 1);
  };

  const signOut = useCallback(async () => {
    await window.api.auth.signOut();
    setProfile(null);
  }, []);

  if (error) return <Splash message={error} onRetry={check} />;
  if (profile === undefined) return <Splash message="Connexion…" />;
  if (!profile) return <Login onSignedIn={setProfile} />;
  return (
    <LiveStoreProvider key={profile.id} profile={profile} onSignOut={signOut}>
      {children}
    </LiveStoreProvider>
  );
}
