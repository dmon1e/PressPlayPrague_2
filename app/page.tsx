"use client";

import { useEffect, useMemo, useState } from "react";

// data & components (relative imports)
import { EVENTS, VENUE, type Event } from "../data/schedule";
import Filters from "../components/Filters";
import EventCard from "../components/EventCard";
import PlanSidebar from "../components/PlanSidebar";
import { makeICS } from "../lib/ics";

// JSON maps (ensure tsconfig.json has "resolveJsonModule": true)
import THEATRES from "../data/theatres.json";
import TICKETS from "../data/tickets.json";

export default function Page() {
  // Filters
  const [q, setQ] = useState("");
  const [day, setDay] = useState<"all" | string>("all");
  const [kind, setKind] = useState<"all" | string>("all");
  const [country, setCountry] = useState<"all" | string>("all");
  const [onlyQA, setOnlyQA] = useState(false);

  // UI
  const [open, setOpen] = useState<Event | null>(null);
  const [plan, setPlan] = useState<Record<string, boolean>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Persist plan
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ppp25-plan");
      if (raw) setPlan(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("ppp25-plan", JSON.stringify(plan));
    } catch {}
  }, [plan]);

  // Filter options
  const days = useMemo(
    () => Array.from(new Set(EVENTS.map((e) => e.date))).sort(),
    []
  );
  const countries = useMemo(
    () => Array.from(new Set(EVENTS.map((e) => e.country))).sort(),
    []
  );

  const filterState = {
    q,
    day,
    kind,
    country,
    onlyQA,
    setQ,
    setDay,
    setKind,
    setCountry,
    setOnlyQA,
    reset: () => {
      setQ("");
      setDay("all");
      setKind("all");
      setCountry("all");
      setOnlyQA(false);
    },
    days,
    countries,
  };

  // Apply filters
  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      if (day !== "all" && e.date !== day) return false;
      if (kind !== "all" && e.type !== kind) return false;
      if (country !== "all" && e.country !== country) return false;
      if (onlyQA && !(e.withQA || e.panel)) return false;
      if (q) {
        const hay = [
          e.title,
          e.description,
          e.director,
          e.notes,
          e.country,
          (e.tags || []).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    }).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  }, [q, day, kind, country, onlyQA]);

  // Group by date
  const grouped = useMemo(
    () =>
      filtered.reduce((acc, ev) => {
        (acc[ev.date] = acc[ev.date] || []).push(ev);
        return acc;
      }, {} as Record<string, Event[]>),
    [filtered]
  );

  const planEvents = useMemo(() => EVENTS.filter((e) => plan[e.id]), [plan]);

  const jumpToPlan = () =>
    document.getElementById("my-plan")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen">
      {/* Compact sticky header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <h1 className="text-base leading-tight font-semibold md:text-xl">
            Press Play Prague — Film Fest Schedule (Oct 7–11, 2025)
          </h1>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="px-3 py-2 rounded-lg border text-sm"
              onClick={jumpToPlan}
              aria-label="Jump to My Schedule"
            >
              ♥ My Schedule
            </button>
            <button
              className="px-3 py-2 rounded-lg border text-sm"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              aria-expanded={mobileFiltersOpen}
              aria-controls="mobile-filters"
            >
              {mobileFiltersOpen ? "Hide Filters" : "Filters"}
            </button>
          </div>
        </div>

        {/* Desktop filters */}
        <div className="hidden lg:block py-2">
          <div className="max-w-6xl mx-auto px-4">
            <Filters state={filterState} />
          </div>
        </div>
      </header>

      {/* Mobile collapsible filters */}
      {mobileFiltersOpen && (
        <div id="mobile-filters" className="lg:hidden border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <Filters state={filterState} />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 space-y-6">
          {Object.keys(grouped).length === 0 && (
            <div className="text-sm text-neutral-500 py-10">
              No events match your filters.
            </div>
          )}

          {days
            .filter((d) => grouped[d] && grouped[d].length)
            .map((d) => (
              <div key={d}>
                <h2 className="text-lg font-semibold mb-3">
                  {new Date(`${d}T00:00:00+02:00`).toLocaleDateString(
                    undefined,
                    { weekday: "long", month: "long", day: "numeric" }
                  )}
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  {grouped[d].map((ev) => (
                    <EventCard
                      key={ev.id}
                      ev={ev}
                      onDetails={() => setOpen(ev)}
                      planned={!!plan[ev.id]}
                      togglePlan={() =>
                        setPlan((p) => ({ ...p, [ev.id]: !p[ev.id] }))
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
        </section>

        <PlanSidebar
          events={planEvents}
          open={(e) => setOpen(e)}
          remove={(id) => setPlan((p) => ({ ...p, [id]: false }))}
        />
      </main>

      {/* Details dialog — 'open' only used INSIDE this block */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">{open.title}</h3>

            <div className="text-sm text-neutral-700 space-y-1 mb-2">
              <div>
                {new Date(`${open.date}T00:00:00+02:00`).toLocaleDateString(
                  undefined,
                  { weekday: "long", month: "long", day: "numeric" }
                )}
              </div>
              <div>⏱ {fmtRange(open.date, open.start, open.durationMin)}</div>

              {/* Location (hall) */}
              {resolveTheatre(open) && (
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {resolveTheatre(open)}
                </div>
              )}

              <div>
                <span className="font-medium">Country:</span> {open.country}
                {open.year ? ` • ${open.year}` : ""}
                {open.runtimeMin ? ` • ${open.runtimeMin}m` : ""}
              </div>
              {open.director && (
                <div>
                  <span className="font-medium">Director:</span>{" "}
                  {open.director}
                </div>
              )}
              {open.description && <p className="pt-2">{open.description}</p>}
              {open.notes && (
                <p className="text-neutral-600 text-[13px]">{open.notes}</p>
              )}
            </div>

            <div className="flex gap-2">
              <a
                className="px-3 py-2 rounded-lg bg-neutral-900 text-white text-sm"
                href={
                  open.ticketUrl ||
                  (TICKETS as Record<string, string>)[open.id] ||
                  VENUE.ticketsHub
                }
                target="_blank"
                rel="noreferrer"
              >
                Tickets
              </a>
              <a
                className="px-3 py-2 rounded-lg border text-sm"
                href={URL.createObjectURL(makeICS(open))}
                download={open.title.replace(/[^a-z0-9]+/gi, "-") + ".ics"}
              >
                + Add to Calendar (.ics)
              </a>
              <button
                className="px-3 py-2 rounded-lg border text-sm"
                onClick={() => setOpen(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-4 py-8 text-xs text-neutral-500">
        <div>
          Built for quick deployment on Vercel. Edit data in{" "}
          <code>data/schedule.ts</code>.
        </div>
        <div className="mt-1">Created by Derek Halsey</div>
      </footer>
    </div>
  );
}

/* ---------- helpers ---------- */

function fmtRange(date: string, start: string, durMin: number) {
  const s = new Date(`${date}T${start}:00+02:00`);
  const e = new Date(s.getTime() + durMin * 60000);
  const f = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  return `${f.format(s)}–${f.format(e)}`;
}

function resolveTheatre(ev: Event) {
  if (ev.theatre) return ev.theatre;

  const byId = (THEATRES as any)?.byId as Record<string, string> | undefined;
  if (byId?.[ev.id]) return byId[ev.id];

  const byKey = (THEATRES as any)?.byKey as Record<string, string> | undefined;
  if (!byKey) return undefined;

  const exact = byKey[makeKey(ev.date, ev.title)];
  if (exact) return exact;

  const tNorm = norm(ev.title);
  const prefix = `${ev.date}|`;

  for (const [k, hall] of Object.entries(byKey)) {
    if (!k.startsWith(prefix)) continue;
    const keyTitle = k.slice(prefix.length);
    if (tNorm.includes(keyTitle) || keyTitle.includes(tNorm)) return hall as string;

    const shortT = tNorm.split(/[/:|–-]/)[0].trim();
    const shortK = keyTitle.split(/[/:|–-]/)[0].trim();
    if (
      shortT === shortK ||
      shortT.startsWith(shortK) ||
      shortK.startsWith(shortT)
    ) {
      return hall as string;
    }
  }

  return undefined;
}

function makeKey(date: string, title: string) {
  return `${date}|${norm(title)}`;
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

