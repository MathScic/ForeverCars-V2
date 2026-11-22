import Card from "../../ui/Card";
import type { ActivityEntry } from "../../demo/types";

const timeFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

export default function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card className="p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-orange mb-4">
        Activité récente
      </h2>
      {entries.length === 0 ? (
        <p className="text-sm text-brand-gray-light/60">Aucune activité pour l'instant.</p>
      ) : (
        <ol className="space-y-3">
          {entries.slice(0, 10).map((e) => (
            <li key={e.id} className="text-sm">
              <p className="text-brand-white">{e.label}</p>
              <p className="text-xs text-brand-gray-light/60 mt-0.5">
                {e.actor} · {timeFormat.format(new Date(e.at))}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
