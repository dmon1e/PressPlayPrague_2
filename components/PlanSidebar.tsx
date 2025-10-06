"use client";

import type { Event } from "../data/schedule";
import { VENUE } from "../data/schedule";

export default function PlanSidebar({
  events,
  open,
  remove,
}: {
  events: Event[];
  open: (e: Event) => void;
  remove: (id: string) => void;
}) {
  return (
    <aside id="my-plan" className="space-y-3 scroll-mt-20">
      {/* ---------- (optional) poster card ----------
      <div className="border rounded-2xl bg-white p-3 hidden lg:block">
        <img
          src="/poster-press-play-2025.png" // place file in /public
          alt="Press Play Prague — October 7–11, 2025"
          className="w-full h-auto rounded-xl shadow-sm"
          loading="lazy"
        />
      </div>
      ---------------------------------------------- */}

      {/* Venue */}
      <div className="border rounded-2xl bg-white p-3">
        <h3 className="font-medium">Venue</h3>
        <div className="mt-1 text-sm text-neutral-700">
          {/* Feel free to change these lines to your exact address */}
          Atlas Cinema
          <div className="text-xs text-neutral-600">Ke Štvanici 4, Prague 8</div>
          <div className="text-xs text-neutral-500">Oct 7–11, 2025 • Europe/Prague</div>
        </div>
        <a
          className="mt-2 inline-block px-3 py-2 rounded-lg bg-neutral-900 text-white text-sm"
          href={VENUE.ticketsHub}
          target="_blank"
          rel="noreferrer"
        >
          Tickets (Kino Atlas)
        </a>
      </div>

      {/* My Plan */}
      <div className="border rounded-2xl bg-white p-3">
        <h3 className="font-medium flex items-center justify-between">
          My Plan <span className="text-xs text-neutral-500">{events.length}</span>
        </h3>

        {events.length === 0 ? (
          <div className="text-sm text-neutral-600 mt-1">
            No saved events yet. Tap ♥ on a film to add it.
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {events.map((ev) => (
              <li key={ev.id} className="border rounded-xl p-2 bg-white">
                <button
                  className="text-left"
                  onClick={() => open(ev)}
                  aria-label={`Open details for ${ev.title}`}
                >
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-xs text-neutral-600">
                    {new Date(`${ev.date}T00:00:00+02:00`).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                    {" • "}
                    {fmtRange(ev.date, ev.start, ev.durationMin)}
                  </div>
                </button>

                <div className="mt-1">
                  <button
                    className="text-xs underline"
                    onClick={() => remove(ev.id)}
                    aria-label={`Remove ${ev.title} from My Plan`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Legend */}
      <div className="border rounded-2xl bg-white p-3">
        <h3 className="font-medium">Legend</h3>
        <ul className="mt-2 text-sm text-neutral-700 space-y-1">
          <li>⏱ shows start–end time</li>
          <li>♥ add/remove from My Plan</li>
          <li>
            <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 border">Q&amp;A/Panel</span>{" "}
            event has Q&amp;A and/or panel
          </li>
        </ul>
      </div>
    </aside>
  );
}

function fmtRange(date: string, start: string, durMin: number) {
  const s = new Date(`${date}T${start}:00+02:00`);
  const e = new Date(s.getTime() + durMin * 60000);
  const f = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${f.format(s)}–${f.format(e)}`;
}
