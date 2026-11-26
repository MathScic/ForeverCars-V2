import { useState, type FormEvent } from "react";
import type { Profile } from "../../../shared/model";
import logo from "../assets/Forever-CarsLogo.svg";
import { errorText } from "../data/store";
import Button, { Arrow } from "../ui/Button";
import { Field, Input } from "../ui/Field";

// Connexion avec le compte créé par l'admin (pas d'inscription libre). La session reste chiffrée sur ce PC.
export default function Login({ onSignedIn }: { onSignedIn: (profile: Profile) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Un espace collé par erreur avant ou après (copier-coller) ne doit pas bloquer la connexion.
      onSignedIn(await window.api.auth.signIn(email.trim(), password.trim()));
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  };

  return (
    <main className="grid h-full place-items-center overflow-y-auto px-6 py-12">
      <form onSubmit={submit} aria-label="Connexion" className="grid w-full max-w-sm gap-7">
        <img src={logo} alt="ForeverCars" className="h-14 w-auto justify-self-start" />
        <div>
          <span className="fc-eyebrow">Back-office</span>
          <h1 className="fc-h2 mt-5">Connexion</h1>
          <p className="mt-4 text-sm text-silver">Avec le compte créé pour vous par l&apos;admin du garage.</p>
        </div>
        <Field label="Adresse e-mail">
          <Input type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Mot de passe">
          <Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={busy} className="justify-center">
          {busy ? "Connexion…" : "Se connecter"} <Arrow />
        </Button>
      </form>
    </main>
  );
}
