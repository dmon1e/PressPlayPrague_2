"use client";
import { useMemo } from "react";
import type { Event } from "@/data/schedule";

export type FiltersState = {
  q: string; day: string; kind: string; country: string; onlyQA: boolean;
  setQ: (s: string) => void; setDay: (s: string) => void; setKind: (s: string) => void;
  setCountry: (s: string) => void; setOnlyQA: (b: boolean) => void; reset: () => void;
  days: string[]; countries: string[];
};

export default function Filters({ state }: { state: FiltersState }) {
  const { q, day, kind, country, onlyQA, setQ, setDay, setKind, setCountry, setOnlyQA, reset, days, countries } = state;

  return (
    <div className="grid gap-2 mb-3 md:grid-cols-6">
      <label className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 col-span-2">
        <span className="opacity-60">🔎</span>
        <input className="w-full outline-none" placeholder="Search title, topic, director…" value={q}
               onChange={(e)=>setQ(e.target.value)} />
      </label>
      <select className="bg-white border rounded-lg px-3 py-2" value={day} onChange={(e)=>setDay(e.target.value)}>
        <option value="all">All days</option>
        {days.map(d=> <option key={d} value={d}>{new Date(`${d}T00:00:00+02:00`).toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric'})}</option>)}
      </select>
      <select className="bg-white border rounded-lg px-3 py-2" value={kind} onChange={(e)=>setKind(e.target.value)}>
        <option value="all">All types</option>
        <option>Film</option><option>Shorts</option><option>Talk</option>
      </select>
      <select className="bg-white border rounded-lg px-3 py-2" value={country} onChange={(e)=>setCountry(e.target.value)}>
        <option value="all">All countries</option>
        {countries.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <label className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
        <input type="checkbox" checked={onlyQA} onChange={(e)=>setOnlyQA(e.target.checked)} /> Has Q&A / Panel
      </label>
      <button onClick={reset} className="border rounded-lg px-3 py-2 bg-white">Reset</button>
    </div>
  );
}
