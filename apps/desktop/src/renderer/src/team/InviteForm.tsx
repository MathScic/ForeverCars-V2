import { useState, type FormEvent } from "react";
import type { Role } from "../../../shared/model";
import Button from "../ui/Button";
import { Field, Input, Select } from "../ui/Field";

interface Props {
  busy: boolean;
  onInvite: (email: string, name: string, role: Role) => Promise<boolean>;
}

// Donner l'accès à quelqu'un : compte créé tout de suite, avec un mot de passe provisoire à lui transmettre.
export default function InviteForm({ busy, onInvite }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("seller");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (await onInvite(email.trim(), name.trim(), role)) {
      setName("");
      setEmail("");
      setRole("seller");
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 border-t border-line pt-6 @min-[760px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_160px_auto] @min-[760px]:items-end">
      <Field label="Prénom et nom">
        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Martin" />
      </Field>
      <Field label="Adresse e-mail">
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@exemple.fr" />
      </Field>
      <Field label="Rôle">
        <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="seller">Vendeur</option>
          <option value="admin">Admin</option>
        </Select>
      </Field>
      <Button type="submit" size="lg" disabled={busy} className="justify-center">
        Donner l&apos;accès
      </Button>
    </form>
  );
}
