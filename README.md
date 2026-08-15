# BuildMart ERP

Production-oriented construction-material billing and inventory application built with **Next.js App Router**, **PostgreSQL**, and **Prisma**. It includes secure cookie sessions, role-ready users, item/customer/supplier masters, stock movement ledger, purchase entry, POS sales, GST tax splits, payment schema, reporting, and downloadable GST invoice PDFs.

## Local setup

1. Install Node.js 20+ and PostgreSQL 15+.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `AUTH_SECRET`.
3. Run `npm install`, then `npm run db:generate`.
4. Apply migrations with `npm run db:migrate` (or `npm run db:deploy` in CI).
5. Load demo data: `npm run db:seed`.
6. Start the app: `npm run dev`.

Open http://localhost:3000 and sign in with `admin@buildmart.local` / `ChangeMe123!`. Change this password before any real deployment.

## Deployment

### Vercel + Supabase

Create a Supabase PostgreSQL project. In Vercel, import this repository, set `DATABASE_URL` to the Supabase transaction pooler connection string and set a strong `AUTH_SECRET`. Set the build command to `npm run build`. Run `npm run db:deploy` once locally or in a release job against the production database, followed by `npm run db:seed` only if initial demo/admin data is needed.

### Railway

Create a Railway PostgreSQL service and deploy this repository as a second service. Link the database or set `DATABASE_URL`, add `AUTH_SECRET`, and use `npm run build` / `npm run start`. Run `npm run db:deploy` as a pre-deploy or one-off command.

## Operational notes

- Sales are rejected when available stock is insufficient; purchases increase stock. Both create `StockMovement` records in the same database transaction as the invoice.
- GST is calculated line-by-line. Intra-state invoices split tax into CGST/SGST; inter-state invoices use IGST.
- E-invoice values (`eInvoiceIrn`, acknowledgement details, e-way bill) are intentionally modelled but no government/GSP credentials are embedded. Add a provider-specific server route that updates those fields after submitting the posted invoice payload.
- For production, add a password-reset flow, audit events, backup policy, and an authorized GST e-invoicing provider integration before filing statutory invoices.


ADMIN (நிர்வாகி)

Email: admin@buildmart.local

Password: ChangeMe123!

MANAGER (மேலாளர்)

Email: manager@buildmart.local

Password: ChangeMe123!

STAFF (பணியாளர்)

Email: staff@buildmart.local

Password: ChangeMe123!

npx prisma studio 


for real api

ClearTax (இப்போது Clear என்று அழைக்கப்படுகிறது) நிறுவனத்தின் விற்பனைப் பிரிவைத் (Sales Team) தொடர்பு கொள்ள அல்லது அவர்களின் API மற்றும் சாஃப்ட்வெர் சேவைகளைப் பெற கீழே உள்ள வழிகளைப் பயன்படுத்தலாம்:

1. தொலைபேசி மூலம் தொடர்பு கொள்ள (Phone Support)
Enterprise / Business Support எண்: 1800-572-8288

மின்னஞ்சல் (Email): einv-support@cleartax.in அல்லது enquiries@cleartax.in

2. அதிகாரப்பூர்வ இணையதளம் மூலம் (Request a Demo / Sales Contact)
ClearTax-ன் அதிகாரப்பூர்வ வலைத்தளமான cleartax.in அல்லது அவர்களின் e-Invoicing/E-Way Bill டெவலப்பர் பக்கத்திற்குச் செல்லவும்.

அங்குள்ள "Get a Free Demo" அல்லது "Contact Sales" பகுதியைத் தேர்ந்தெடுக்கவும்.

உங்கள் நிறுவனத்தின் பெயர், ஜிஎஸ்டி எண் (GSTIN), மின்னஞ்சல் மற்றும் தொலைபேசி எண்ணைப் பதிவு செய்தால், அவர்களின் விற்பனைப் பிரதிநிதி (Sales Representative) உங்களைத் நேரடியாகத் தொடர்புகொண்டு API விவரங்களையும் விலைப் பட்டியலையும் வழங்குவார்.