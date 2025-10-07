"use client";

import { useMemo } from "react";
import type { Event, Venue } from "../data/schedule";
import { VENUE } from "../data/schedule";
import THEATRES from "../data/theatres.json";
import TICKETS from "../data/tickets.json";

// small helpers
function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function keyByDateTitle(date: string, title: string) {
  return `${date}|${slug(title)}`;
}

type Props = {
  ev: Event;
  planned: boolean;
  togglePlan: () => void;
  onDetails: () => void;
};

export default function EventCard({ ev, planned, togglePlan, onDetails }: Props) {
  // robust hall resolution: explicit on event -> byId -> byKey (date+title)
  const theatre = useMemo(() => {
    const byId = (THEATRES as any)?.byId?.[ev.id];
    const byKey = (THEATRES as any)?.byKey?.[keyByDateTitle(ev.date, ev.title)];
    const chosen = ev.theatre ?? byId ?? byKey ?? "";
    if (!chosen && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "Missing hall mapping for:",
        ev.id,
        "fallback key:",
        keyByDateTitle(ev.date, ev.title)
      );
    }
    return chosen;
  }, [ev]);

  // EU time formatter
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }),
    []
  );

  const start = new Date(`${ev.date}T${ev.start}:00+02:00`);
  const end = new Date(start.getTime() + ev.durationMin * 60000);
  const timeRange = `${fmt.format(start)}–${fmt.format(end)}`;

  const ticketHref =
    ev.ticketUrl || (TICKETS as Record<string, string>)[ev.id] || VENUE.ticketsHub;

  // show tiny debug id/hall only with ?debug=1
  const debug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("debug");

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="text-[18px] font-semibold leading-snug">{ev.title}</h3>

      <div className="mt-1 text-sm text-neutral-700 flex items-center gap-2">
        <span className="select-none">⏱</span>
        {timeRange}
      </div>

      {theatre && (
        <div className="mt-1 text-sm text-neutral-700 flex items-center gap-2">
          <span className="select-none">📍</span>
          {theatre}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {["type", "country"].map((k) => {
          const val = (ev as any)[k];
          return val ? (
            <span
              key={k}
              className="rounded-full border px-2 py-1 text-xs text-neutral-700"
            >
              {val}
            </span>
          ) : null;
        })}
        {(ev.tags || []).map((t) => (
          <span
            key={t}
            className="rounded-full border px-2 py-1 text-xs text-neutral-700"
          >
            {t}
          </span>
        ))}
      </div>

      {ev.description && (
        <p className="mt-3 text-[13px] text-neutral-700 leading-5">{ev.description}</p>
      )}

      {debug && (
        <div className="mt-1 text-[10px] text-neutral-500">
          id: <code>{ev.id}</code> • hall:{" "}
          <code>{theatre || "—"}</code> • key:{" "}
          <code>{keyByDateTitle(ev.date, ev.title)}</code>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <a
          href={ticketHref}
          target="_blank"
          className="rounded-lg bg-neutral-900 text-white px-3 py-2 text-sm"
        >
          Tickets
        </a>
        <button
          onClick={onDetails}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Details
        </button>
        <button
          onClick={togglePlan}
          className={`ml-auto rounded-lg border px-3 py-2 text-sm ${
            planned ? "bg-neutral-900 text-white" : ""
          }`}
          aria-pressed={planned}
          title={planned ? "Remove from My Plan" : "Add to My Plan"}
        >
          {planned ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
