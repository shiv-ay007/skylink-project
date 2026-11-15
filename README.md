# SkyLink MERN Website + Admin Panel

A **three-application, database-backed** logistics website based on the supplied SkyLink screenshots. This is an original implementation with a similar visual language, navigation and modules; it is **not** a bit-for-bit export of the live site's source code. The generated container-ship hero artwork is inspired by the reference and the small logo asset was cropped from the user-supplied screenshot. Exact original site photography and unavailable legal/about-page copy are not included.

## Folder structure

```text
skylink-mern-clone/
├── frontend/                 # React + Vite + Tailwind customer website
│   ├── public/               # hero-port.png, skylink-logo.png
│   └── src/
│       ├── api/              # All API calls with Axios
│       ├── components/       # Header, Footer, reusable UI
│       ├── context/          # User auth, site settings
│       ├── pages/            # Home, Tracking, Schedule, Login etc.
│       └── routes/           # ProtectedRoute
├── backend/                  # Express.js MVC REST API + MongoDB
│   ├── app.js                # SERVER ENTRYPOINT
│   ├── .env                  # Generated LOCAL development secrets
│   └── src/
│       ├── config/           # MongoDB connection
│       ├── models/           # Mongoose schemas
│       ├── controllers/      # Business logic
│       ├── routes/           # REST routes
│       ├── middleware/       # Auth, validation, error handling
│       ├── utils/            # Shared functions, mailer
│       └── scripts/          # Site settings DB initializer
└── admin-panel/              # Separate React + Tailwind dashboard
    └── src/
        ├── api/              # Admin API client with JWT
        ├── components/       # CRUD modal, spinner
        ├── layouts/          # Admin sidebar/header
        ├── pages/            # Dashboard, CRUD, Settings, Login
        ├── routes/           # Role-protected routes
        └── utils/            # Admin resource definitions
```

## Requirements

- Node.js 22+ (Firebase Admin SDK)
- npm
- MongoDB installed locally (default `mongodb://127.0.0.1:27017/skylink_clone`) **or** a MongoDB Atlas URI

## Setup — Windows (recommended)

1. Extract ZIP. Open the extracted directory in VS Code.
2. Start local MongoDB service (or edit `backend/.env` to use Atlas).
3. Run `install-windows.bat` **or** in three terminals run:

```bash
cd backend && npm install
cd frontend && npm install
cd admin-panel && npm install
```

4. **Important:** Initialize real MongoDB website settings. From the `backend` folder:

```bash
npm run seed:site
```

This inserts actual homepage branding, services, footer text and reference logo/hero URLs into MongoDB if not already configured. It **does not** create fake users, fake bookings, fake shipments or hardcoded API response fallback arrays.

5. Run `start-windows.bat` (three dev server windows), or run individually:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev

# Terminal 3
cd admin-panel
npm run dev
```

6. Visit:

| App | Development URL |
|---|---|
| Customer website | http://localhost:5173 |
| Admin panel | http://localhost:5174 |
| API health | http://localhost:5000/api/health |

## First administrator / login

1. Visit **http://localhost:5174/register**.
2. Enter admin name, email, password (minimum 8 chars) and **`ADMIN_SETUP_KEY` from `backend/.env`**.
3. This route can create only the **first administrator**; later attempts are blocked. After that, an authenticated admin can add employees/admins/customers in the **Users** module.
4. Login at `/login`. Employee role has **read-only** admin access; admin role can create/edit/delete.
5. Public customers register from **http://localhost:5173/register**. Public registration always creates `customer` role: users cannot self-elevate to admin.

**Security:** The `.env` files in this ZIP are for local testing. Backend `.env` contains independently generated secret strings for this package; rotate them and store secrets privately for production. Never commit `.env`, customer data or production credentials to git. For real production deployments use HTTPS, proper backups, security audits and stronger operational controls.

## Website sections

- Home, responsive navbar, service dropdown, four-tab quick action card (Tracking / Schedule / Offices / ONE QUOTE)
- Shipment tracking using tracking number / BL / booking / container / PO (up to 10 numbers)
- Vessel schedules (DB filtering and pagination)
- Ports/offices (DB lookup and pagination)
- Services (editable from Settings)
- News articles and article detail (published articles only)
- Contact form (writes Message document)
- Quote form (writes Quote document)
- Customer register/login, profile edit
- Customer booking creation, list, cancellation
- About / FAQ / Terms / Privacy / Careers pages, editable from admin Settings
- Footer text, links, social networks, address and branding editable in admin Settings

## Admin sections

Dashboard (live counts + recent shipments); Users; Shipments; Bookings; Schedules; Ports; Vessels; Vehicle Details; News; Quotes; Messages; Settings. All listing screens load from MongoDB through protected Axios APIs with server-side pagination, search, filters and CRUD actions. Admin forms provide toast success/error messages.

**Typical sequence:** Create a Vessel and Ports → Create a Schedule → Create/assign a Shipment → update statuses and timeline → customers can track it. Create a News article, set status to `published`, then it appears on the public News page. Quotes and contact messages appear in their admin queues.

## REST API summary

| Path | Method | Scope |
|---|---|---|
| `/api/health` | GET | Public health |
| `/api/auth/register` | POST | Customer register |
| `/api/auth/admin-register` | POST | First-admin setup key required |
| `/api/auth/login` | POST | Login, returns JWT |
| `/api/auth/me` | GET/PATCH | JWT, profile |
| `/api/public/settings` | GET | Public settings |
| `/api/public/track?numbers=...` | GET | Public shipment lookup |
| `/api/public/schedules` | GET | Public vessel schedule |
| `/api/public/ports` | GET | Port/office directory |
| `/api/public/news` | GET | Published articles |
| `/api/public/news/:slug` | GET | Published article detail |
| `/api/public/quotes` | POST | Submit quote |
| `/api/public/messages` | POST | Submit contact message |
| `/api/public/my-bookings` | GET | JWT, own bookings |
| `/api/public/bookings` | POST | JWT, create booking |
| `/api/public/bookings/:id/cancel` | PATCH | JWT, own booking |
| `/api/admin/dashboard` | GET | Admin/employee |
| `/api/admin/settings` | GET/PUT | Admin/employee read, admin write |
| `/api/admin/upload` | POST | Admin, image file upload |
| `/api/admin/:resource` | GET/POST | Admin/employee read, admin create |
| `/api/admin/:resource/:id` | GET/PATCH/PUT/DELETE | Admin/employee read, admin edit/delete |

Resources: `users`, `shipments`, `bookings`, `schedules`, `ports`, `vessels`, `vehicles`, `news`, `quotes`, `messages`. New quotes/messages are submitted via public forms and their statuses can be updated in admin.

### List pagination example

```http
GET /api/admin/shipments?page=2&limit=10&status=BOOKED&search=SKLU
Authorization: Bearer <JWT>
```

Response structure:

```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 2, "limit": 10, "total": 0, "pages": 0 }
}
```

The response above illustrates **shape only**, not example database content. Backend uses indexed identifiers, `.lean()`, bounded query/page sizes, `skip` / `limit`, `countDocuments` and a shared error handler. For extremely large datasets, use cursor pagination / MongoDB Atlas Search instead of unrestricted contains-regex searches; the present implementation is suitable as a project foundation.

## Image uploads

In admin, the News image field and Settings page can upload JPG/PNG/WEBP/GIF files (maximum 5 MB). Uploaded files are persisted to `backend/uploads` and served via `/uploads/...`. Back up this directory. For production prefer managed object storage and image-content verification.

## SMTP emails

The quote and contact submissions save to MongoDB even when SMTP is unconfigured. To enable optional new-enquiry email notifications, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `CONTACT_TO_EMAIL` in `backend/.env`. **SMS, push and weekly-reports delivery are not implemented**; Settings currently stores these preferences only.

## Important completeness notes

- **No test database records or fallback response arrays:** an empty database returns an empty list. Dashboard totals show actual database counts.
- The live SkyLink HTML is JavaScript-rendered and not available as a full source export. The provided screenshots determined colors/layout/modules. Some original page wording/photography cannot be matched exactly without the actual files/content. Put exact originals into website assets and update DB Settings if you own rights to use them.
- This ZIP contains full project **source and dependency manifests**, not `node_modules`. Install dependencies on an internet-connected machine. Runtime compilation could not be verified where this archive was created because the npm registry was unreachable; JavaScript and JSX syntax checks were performed.
- Full payment processing, third-party carrier live tracking feeds, SMS sending and actual port-specific scheduling feeds are **not included**. These require external services and credentials. The locally entered tracking and shipping records are fully database-backed.

---

## Update: Firebase Google Login + Visual Redesign

**What's new**
- Photo cards for SkyLink services, sourced from the actual MongoDB `Setting.services[]` documents. Generated image assets are bundled at `frontend/public/service-images/` and `admin-panel/public/service-images/`. Images are editable from **Admin Panel > Settings > Services**.
- Animated photo zoom/hover, concise card previews, "Explore Service" and "Get a Quote" CTAs.
- Redesigned customer Account page with profile panel, real booking total from `/api/public/my-bookings`, booking and support shortcuts, and a refreshed login/register page.
- Optional Google Sign-In through Firebase, verified on the Express backend and exchanged for the project's existing JWT. Other modules continue to use MongoDB + Express; the admin's login remains unchanged.
- **Fixed** missing `Link` import in `frontend/src/App.jsx`.

### 1) Install packages

Requires **Node.js 22+** for the current Firebase Admin SDK; MongoDB must be available.

```bash
cd frontend
npm install
cd ../backend
npm install
cd ../admin-panel
npm install
```

### 2) Sync service photos into existing MongoDB data

From the **backend** folder:

```bash
npm run seed:site
```

This command is repeatable: it inserts settings only if missing and fills missing `imageUrl` fields for *known* service names. **It never overwrites existing service images or edits**. The site continues to load services through the backend API; no frontend data fixtures are used. For a brand-new custom service, upload your own photo in Admin Panel > Settings > Services.

### 3) Enable Firebase Google Login (optional)

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a Firebase project and Web app.
2. Under **Authentication > Sign-in method**, enable **Google**.
3. Under **Authentication > Settings > Authorized domains**, add the domain where the website is served. Add your local test domain too, if required.
4. Copy your Firebase web app configuration into `frontend/.env`:

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

5. Open **Firebase Console > Project Settings > Service Accounts**, generate a service account JSON for the same Firebase project, and keep the JSON secret. For simple local testing only, place it at `backend/firebase-service-account.json` (it is excluded from git). For production, use workload identity or an appropriate secrets manager.
6. Set these two variables in `backend/.env`:

   ```env
   FIREBASE_PROJECT_ID=your-project-id
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
   ```

7. Restart both frontend and backend servers. Go to SkyLink > Login > **Continue with Google**.

**How auth works:** Firebase authenticates the Google account and returns an ID token. The backend verifies the token (`POST /api/auth/google`), creates a `customer` user in MongoDB *only if no email collision exists*, and returns the SkyLink JWT. All booking APIs keep using that JWT. Users cannot use Google sign-in to create admin accounts. An email already registered with a password is intentionally **not** automatically linked to Google; use the existing password in that case.

**API endpoint:** `POST /api/auth/google` with body `{ "idToken": "<FIREBASE_ID_TOKEN>" }`. Returns `{ success, token, user }`.

**Important:** No Firebase project ID, API key or Google service account is supplied in this ZIP. The Google button is disabled until you add your **own** Firebase configuration. Existing email/password login still works without Firebase. The Admin Panel does not use Firebase.

### 4) Production notes

- Configure production `CLIENT_URL` and `ADMIN_URL` (CORS), `VITE_API_URL`, Firebase authorized domain and HTTPS.
- Ensure downloaded service account JSON files are **not committed** or placed in the frontend. Production servers should use Google Application Default Credentials with managed secrets/workload identity.
- `GOOGLE_APPLICATION_CREDENTIALS` is a *backend-only* environment variable. Never prefix it with `VITE_`.
- Store only approved customer information. Keep admin setup keys private.

### Safe upgrade of an existing SkyLink installation

1. Back up your existing `frontend/.env`, `backend/.env` and `admin-panel/.env`, and do **not** delete your MongoDB database.
2. Replace the source files using this updated project, retaining your own `.env` files. (The ZIP deliberately excludes `.env` files and private credentials.)
3. Run `node scripts/setup-env.mjs` from the project root if using a fresh installation; it creates `.env` files and fresh random backend secrets if missing, without overwriting any existing `.env`.
4. Run `install-windows.bat` or install npm dependencies in all three folders, then run `cd backend && npm run seed:site`.
5. Restart the 3 apps. Google sign-in is available **only** after you add your own Firebase values and service account credentials as described above.

**Verification scope:** Backend JavaScript and frontend/admin JSX syntax were checked. Full `npm run build` and live Google login could not be tested in the packaging environment because the npm registry was unreachable and no Firebase project credentials were supplied.
