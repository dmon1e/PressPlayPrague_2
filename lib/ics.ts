import type { Event } from "@/data/schedule";

function toCal(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function makeICS(ev: Event) {
  const dtStart = new Date(`${ev.date}T${ev.start}:00+02:00`);
  const dtEnd = new Date(dtStart.getTime() + ev.durationMin * 60000);
  const desc = `${ev.description ?? ""}${ev.notes ? "\n\nNotes: " + ev.notes : ""}`;
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Press Play Prague//Schedule//EN",
    "BEGIN:VEVENT",
    `UID:${ev.id}@pressplayprague`,
    `DTSTAMP:${toCal(new Date())}`,
    `DTSTART:${toCal(dtStart)}`,
    `DTEND:${toCal(dtEnd)}`,
    `SUMMARY:${escapeICS(ev.title + " — Press Play Prague")}`,
    `LOCATION:${escapeICS("Atlas Cinema, Ke Štvanici 4, Prague 8, Czech Republic")}`,
    `DESCRIPTION:${escapeICS(desc)}`,
    "END:VEVENT","END:VCALENDAR"
  ].join("\n");
  return new Blob([ics], { type: "text/calendar" });
}

function escapeICS(s: string) {
  return (s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,|;/g, (m) => `\\${m}`);
}
