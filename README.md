# Product Page Project (Next.JS + Medusa)

Ovaj repozitorij sadrži **dva projekta**: backend sustav **Medusa** i frontend aplikaciju **Next.js**. 

Cilj projekta je izraditi Product stranicu prema priloženom Figma dizajnu koristeći Next.js, TypeScript i TailwindCSS, te ju integrirati s Medusa sustavom pomoću Medusa JS SDK-a.

---

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

1. Instalirajte *dependencies*:
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

3. Pokrenite Medusa backend
```bash
npm run start
npm run dev (za developere)
```

## Frontend (Next.js)

1. Instalirajte *dependencies*:
    ```bash
    cd frontend
    npm install
    ```
2. Pokrenite aplikaciju:
`npm run dev`

3. Aplikacija će biti dostupna na `http://localhost:3000`