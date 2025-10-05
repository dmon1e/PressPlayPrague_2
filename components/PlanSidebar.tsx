"use client";
import type { Event } from "@/data/schedule";

export default function PlanSidebar({ events, open, remove }:{ events: Event[], open: (e:Event)=>void, remove:(id:string)=>void }){
  return (
    <aside className="space-y-3">
      <div className="border rounded-2xl bg-white p-3">
        <h3 className="font-medium flex items-center justify-between">Venue <span className="text-xs text-neutral-500">Oct 7–11 • Europe/Prague</span></h3>
        <div className="text-sm">Atlas Cinema</div>
        <div className="text-xs text-neutral-600">Ke Štvanici 4, Prague 8</div>
        <a className="mt-2 inline-block px-3 py-2 rounded-lg bg-neutral-900 text-white text-sm" href="https://www.kinoatlaspraha.cz/?tag=111" target="_blank">Tickets (Kino Atlas)</a>
      </div>
      <div className="border rounded-2xl bg-white p-3">
        <h3 className="font-medium flex items-center justify-between">My Plan <span className="text-xs">{events.length}</span></h3>
        {events.length === 0 ? <div className="text-sm text-neutral-600">No saved events yet. Tap ♥ to add.</div> : (
          <ul className="text-sm space-y-2">
            {events.map(ev => (
              <li key={ev.id} className="border rounded-xl p-2 bg-white">
                <button onClick={()=>open(ev)} className="text-left">
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-xs text-neutral-600">{new Date(`${ev.date}T00:00:00+02:00`).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})} • {fmtRange(ev.date, ev.start, ev.durationMin)}</div>
                </button>
                <div className="mt-1"><button className="text-xs underline" onClick={()=>remove(ev.id)}>Remove</button></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function fmtRange(date: string, start: string, durMin: number){
  const s = new Date(`${date}T${start}:00+02:00`);
  const e = new Date(s.getTime() + durMin*60000);
  const f = new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"});
  return `${f.format(s)}–${f.format(e)}`;
}
