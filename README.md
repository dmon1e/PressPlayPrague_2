# Press Play Prague — Film Fest Schedule (Next.js + Tailwind)

Interactive schedule with filters, "My Plan" (localStorage), per-event dialog, Tickets button, and .ics export.

## Local dev
```bash
npm install
npm run dev
```

## Deploy to Vercel
```bash
npm i -g vercel
vercel
vercel --prod
```
Or connect the repo in Vercel dashboard and click **Deploy**.

## Edit content
- **Schedule data:** `data/schedule.ts` (add/edit events, update `VENUE.ticketsHub`, add per-event `ticketUrl` if you have deep links).
- **Header text:** `app/page.tsx` (main title).
- **Venue box:** `components/PlanSidebar.tsx` (address, label).
- **Logo:** replace `public/logo.svg` and reference it in `app/page.tsx` header if desired.
- **Colors/spacing:** Tailwind utility classes in components.

## Add your logo in header
In `app/page.tsx`, inside the `<header>` element, you can add:
```tsx
<div className="flex items-center gap-2">
  <img src="/logo.svg" alt="Press Play" className="h-6 w-auto" />
  <h1 className="text-xl font-semibold">Press Play Prague — Film Fest Schedule (Oct 7–11, 2025)</h1>
</div>
```

## Optional
- Convert to a PWA with `next-pwa` for offline caching.
- Add analytics via Vercel Analytics or a lightweight snippet.
