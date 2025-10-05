"use client";
import { makeICS } from "@/lib/ics";
import type { Event } from "@/data/schedule";

export default function EventCard({ ev, onDetails, planned, togglePlan }:{
  ev: Event; onDetails: ()=>void; planned: boolean; togglePlan: ()=>void;
}){
  const time = fmtRange(ev.date, ev.start, ev.durationMin);
  return (
    <div className="border rounded-2xl bg-white p-3 hover:shadow-sm transition">
      <h3 className="font-medium">{ev.title}</h3>
      <div className="text-xs text-neutral-600">⏱ {time}</div>
      <div className="flex flex-wrap gap-2 my-2">
        <span className="text-xs border rounded-full px-2 py-1 bg-indigo-50 border-indigo-100">{ev.type}</span>
        {ev.country && <span className="text-xs border rounded-full px-2 py-1 bg-slate-50">{ev.country}</span>}
        {(ev.withQA || ev.panel) && <span className="text-xs border rounded-full px-2 py-1">Q&A/Panel</span>}
        {(ev.tags || []).slice(0,2).map(t => <span key={t} className="text-xs border rounded-full px-2 py-1">{t}</span>)}
      </div>
      {ev.description && <p className="text-sm text-neutral-700 line-clamp-3">{ev.description}</p>}
      <div className="flex items-center gap-2 justify-between mt-2">
        <a className="px-3 py-2 rounded-lg bg-neutral-900 text-white text-sm" href={ev.ticketUrl || 'https://www.kinoatlaspraha.cz/?tag=111'} target="_blank">Tickets</a>
        <button className="px-3 py-2 rounded-lg border text-sm" onClick={onDetails}>Details</button>
        <button className={"w-9 h-9 rounded-lg border " + (planned ? "bg-neutral-900 text-white" : "bg-white")} onClick={togglePlan}>♥</button>
      </div>
    </div>
  );
}

function fmtRange(date: string, start: string, durMin: number){
  const s = new Date(`${date}T${start}:00+02:00`);
  const e = new Date(s.getTime() + durMin*60000);
  const f = new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"});
  return `${f.format(s)}–${f.format(e)}`;
}
