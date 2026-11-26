import { useEffect, useState } from "react";
import type { Role, TeamMember } from "../../../shared/model";
import { errorText, useStore } from "../data/store";
import Card from "../ui/Card";
import ConfirmDialog from "../ui/ConfirmDialog";
import InviteForm from "./InviteForm";
import MemberRow from "./MemberRow";
import PasswordReveal from "./PasswordReveal";

// Membres réels de l'équipe (via l'Edge Function « team », réservée à l'admin).
export default function LiveMembers() {
  const { userId, notify } = useStore();
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [reveal, setReveal] = useState<{ name: string; password: string } | null>(null);
  const [removing, setRemoving] = useState<TeamMember | null>(null);
  const [resetting, setResetting] = useState<TeamMember | null>(null);

  useEffect(() => {
    let alive = true;
    window.api.team.list().then((list) => alive && setMembers(list), (e: unknown) => alive && notify(errorText(e)));
    return () => {
      alive = false;
    };
  }, [notify]);

  /** Lance une action ; renvoie false (message affiché) si elle échoue. */
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
      return true;
    } catch (e) {
      notify(errorText(e));
      return false;
    } finally {
      setBusy(false);
    }
  };
  const invite = (email: string, name: string, role: Role) =>
    run(async () => {
      const r = await window.api.team.invite(email, name, role);
      setMembers(r.members);
      setReveal({ name, password: r.password });
    });

  return (
    <Card className="grid gap-6 p-7">
      <h2 className="fc-h3">Membres</h2>
      {!members && <p className="text-sm text-silver">Chargement…</p>}
      <ul>
        {members?.map((m) => (
          <MemberRow
            key={m.id}
            member={m}
            isMe={m.id === userId}
            busy={busy}
            onRole={(role) => void run(async () => setMembers(await window.api.team.setRole(m.id, role)))}
            onResetPassword={() => setResetting(m)}
            onAccess={(enabled) => (enabled ? void run(async () => setMembers(await window.api.team.setAccess(m.id, true))) : setRemoving(m))}
          />
        ))}
      </ul>
      <InviteForm busy={busy} onInvite={invite} />
      {reveal && <PasswordReveal name={reveal.name} password={reveal.password} onClose={() => setReveal(null)} />}
      {resetting && (
        <ConfirmDialog
          title={`Nouveau mot de passe pour ${resetting.name} ?`}
          confirmLabel="Générer"
          busy={busy}
          onCancel={() => setResetting(null)}
          onConfirm={() =>
            void run(async () => setReveal({ name: resetting.name, password: await window.api.team.resetPassword(resetting.id) })).then(() =>
              setResetting(null),
            )
          }
        >
          <p>Son mot de passe actuel (provisoire ou choisi) ne fonctionnera plus. À utiliser seulement s&apos;il est perdu.</p>
        </ConfirmDialog>
      )}
      {removing && (
        <ConfirmDialog
          title={`Retirer l'accès de ${removing.name} ?`}
          confirmLabel="Retirer l'accès"
          danger
          busy={busy}
          onCancel={() => setRemoving(null)}
          onConfirm={() => void run(async () => setMembers(await window.api.team.setAccess(removing.id, false))).then(() => setRemoving(null))}
        >
          <p>La personne ne peut plus se connecter. Rien n&apos;est effacé : ses véhicules restent, et l&apos;accès peut être rétabli.</p>
        </ConfirmDialog>
      )}
    </Card>
  );
}
