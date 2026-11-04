# StayFinder – frontend

Next.js 16 (App Router) + TypeScript + Tailwind.

Backend och lista över uppfyllda kriterier: se `stay-finder-be` (README.md och KRITERIER.md).

## Kom igång

```bash
npm install
echo NEXT_PUBLIC_BACKEND_URL=http://localhost:3000 > .env.local
npm run dev   # http://localhost:3001 (backend kör på 3000)
```

Inloggningen är en httpOnly-cookie som backend sätter. Alla anrop görs med `credentials: "include"` (se `utils/api.ts`). Frontenden måste köra på `localhost:3001`, eftersom backend bara tillåter den adressen i CORS (`FRONTEND_URL`).

## Sidor

| Route | Innehåll |
|---|---|
| `/` | Lista med filter (plats, maxpris, gäster, lediga datum) och sortering på pris |
| `/properties/[id]` | Detaljsida, bokningsformulär med kalender, nätter + totalpris, bokningar för boendet |
| `/auth/login`, `/auth/register` | Logga in / skapa konto |
| `/bookings` | Mina bokningar |
| `/host/properties/new` | Skapa boende |
| `/host/properties/[id]/edit` | Ändra boende (ägare) |

Laddningsvy: `app/loading.tsx`, `ListSkeleton`. Felvy: `app/error.tsx`. 404 för boende: `app/properties/[id]/not-found.tsx`.

## Struktur

```
app/          sidor (server components hämtar publik data)
components/   UI; klientkomponenter för formulär och bokningar
contexts/     AuthContext – vem som är inloggad (G2)
utils/        api.ts (fetch + felformat), auth-, property-, bookingService
types/        typer genererade från databasen + API-typer
```
