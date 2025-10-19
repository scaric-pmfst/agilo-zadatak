# Product Page Project (Next.JS + Medusa)

Ovaj repozitorij sadrži **dva projekta**: backend sustav **Medusa** i frontend aplikaciju **Next.js**.

Cilj projekta je izraditi Product stranicu prema priloženom Figma dizajnu koristeći Next.js, TypeScript i TailwindCSS, te ju integrirati s Medusa sustavom pomoću Medusa JS SDK-a.

---

## Demo

https://github.com/user-attachments/assets/310feda9-8c2c-425c-b44a-7a91939e8078

## Projekti

1. **Backend** - backend Medusa sustav

   - Upravljanje proizvodima i varijantama (boje, cijene, materijali...)

2. **Frontend** - frontend Next.Js aplikacija
   - Prikaz proizvoda i detalja proizvoda na stranici
   - Dodavanje odabira varijante materijala i boja proizvoda
   - Prikaz broja artikala u košarici u headeru
   - Desktop i mobilna verzija aplikacije (Responsive dizajn)
   - Integracija sa Medusa backendom preko Medusa JS SDK-a

---

## Tehnologije

- **Frontend:** Next.js, TypeScript, TailwindCSS, Medusa JS SDK
- **Backend:** Medusa (Node.js)

---

## Instalacija i pokretanje

## Backend (Medusa)

0. Potrebno je da imate Node.js v20 (i novije), Git i PostgreSQL.

1. Instalirajte _dependencies_:
   ```bash
   cd backend
   npm install
   ```
2. Kreirajte `.env` datoteku u kojoj postavljate PostgreSQL URL:

```
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgres://<postgre ime>:<postgre sifra>@localhost/<postgre baza podataka>
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=frontend
```

3. Pokrenite Medusa backend:
   (Admin Panel)

```bash
npm run dev
```

(Bez Admin Panel-a)

u `medusa-config.ts` treba nadodati:

```typescript
module.exports = defineConfig({
  ... // Trenutni Kod
  admin: {
    disable: true,
  },
})
```

```bash
npm run build
npm run start (Bez Admin Panel-a)
```

Medusa Store će biti dostupna na portu `9000` (`http://localhost:9000`)

4. (Opcionalno) Ako želite imati demo podatke:
```bash
npm run seed
```

## Frontend (Next.js)

1. Instalirajte _dependencies_:
   ```bash
   cd frontend
   npm install
   ```

2. Kreirajte `.env.local` datoteku u kojoj postavljate Medusa API:
```
NEXT_PUBLIC_MEDUSA_API_KEY=
NEXT_PUBLIC_MEDUSA_URL=
```


3. Pokrenite aplikaciju:

(Developer)

`npm run dev`

(Production)

```bash
npm run build
npm run start
```

4. Aplikacija će biti dostupna na `http://localhost:3000`

---

## Izvještaj o zadatku (Project Report)

### Procijenjeno vrijeme izrade

| Aktivnost                        | Procijenjeno vrijeme | Stvarno vrijeme | Napomena                                                              |
| -------------------------------- | -------------------- | --------------- | --------------------------------------------------------------------- |
| Planiranje/Analiza Figma dizajna | 2h                   | 2h              |                                                                       |
| Postavljanje backend-a (Medusa)  | 1h                   | ~1h 40min       |                                                                       |
| Postavljanje frontend-a (Nextjs) | 2h                   | ~1h 20min       |                                                                       |
| Implementacija funkcionalnosti   | 6h                   | ~5h 10min       |                                                                       |
| Testiranje i popravke            | 2h                   | ~1h 20min       | Većina testiranja je izvršena tijekom implementiranja funkcionalnosti |
| Dokumentacija                    | 1h                   | ~30min          |                                                                       |
| Ukupno                           | 14h                  | ~12h            |                                                                       |

---

### Kratki osvrt na najzahtjevnije dijelove zadatka

1. **Postavljanje backend-a i korištenje SDK-a**

   - Najviše vremena je otišlo na istraživanje Meduse pošto je ovo prvi put da radim sa platformom.
   - Problem je nastao kod pokretanja pomoću `npm run start` (production) koji nije radio sve dok nisam implementirao onemogućavanje ugrađenog admin panela (ovo bi trebalo dodatno pogledat kako točno radi pošto je trenutno rješenje neefikasno).

2. **Debugiranje**
   - Za debugiranje je bilo potrebno pisanja puno log-ova i implementiranje elemenata koji prikazuju debug informacije na samoj stranici (koji su trenutno zakomentirani) kako bi se provjerio kod (dohvaćanje varijanti produkata, cijene...)
