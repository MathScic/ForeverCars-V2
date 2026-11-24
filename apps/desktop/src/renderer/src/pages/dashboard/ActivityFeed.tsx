import Card from "../../ui/Card";
import type { ActivityEntry } from "../../demo/types";

const timeFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

export default function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card className="p-6">
      <span className="fc-eyebrow">Activité récente</span>
      {entries.length === 0 ? (
        <p className="mt-5 text-sm text-silver">Aucune activité pour l&apos;instant.</p>
      ) : (
        <ol className="mt-5">
          {entries.slice(0, 8).map((e) => (
            <li key={e.id} className="border-t border-line py-3 text-sm first:border-t-0 first:pt-0">
              <p>{e.label}</p>
              <p className="mt-1 text-xs text-silver">
                {e.actor} · {timeFormat.format(new Date(e.at))}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
