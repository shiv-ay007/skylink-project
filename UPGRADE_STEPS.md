# SkyLink – Firebase + Services UI update

## What was changed

- `frontend/src/pages/Home.jsx` — attractive services gallery, image zoom on hover, hero CTAs, extra features and blue CTA banner.
- `frontend/src/pages/Services.jsx` — responsive service listing and full-width image details.
- `frontend/src/components/ServiceCard.jsx` — reusable image card, hover animation, quote/detail links.
- `frontend/src/pages/Account.jsx` — refreshed account dashboard with booking total from MongoDB API, profile editing, quick navigation and CTAs.
- `frontend/src/pages/Auth.jsx` — redesigned login/register UI + Google sign-in button.
- `frontend/src/firebase/firebase.js` — Firebase Web SDK initialization using environment variables.
- `frontend/src/context/AuthContext.jsx`, `frontend/src/api/index.js` — login bridge to existing JWT.
- `backend/src/config/firebaseAdmin.js`, `backend/src/controllers/authController.js`, `backend/src/routes/authRoutes.js`, `backend/src/models/User.js`, `backend/src/middleware/validate.js` — verification, user creation, token exchange, validation and role protection.
- `backend/src/scripts/seedSite.js` — sets service image references in MongoDB where absent.
- `frontend/public/service-images/*.webp` and `admin-panel/public/service-images/*.webp` — five included generated logistics images.
- `frontend/src/App.jsx` — fixes `Link is not defined` error.
- `frontend/src/components/ErrorBoundary.jsx` — renders a friendly error page if React crashes.

## Upgrade existing installation

1. Backup your `.env` files and database before replacing source files.
2. Extract this new ZIP, copy the existing `.env` files into the matching three folders.
3. Run `node scripts/setup-env.mjs` from the extracted project's root; it only creates missing envs and does not overwrite any existing ones.
4. Run `install-windows.bat` or run `npm install` separately in `backend`, `frontend`, and `admin-panel`.
5. From `backend`, run `npm run seed:site`. This updates missing service image references in your EXISTING MongoDB settings; it does not overwrite your custom images.
6. Start all servers, open SkyLink and check Services, My Account and Login.
7. Enable Google Sign-in by adding **your Firebase Web App config** to `frontend/.env`, `FIREBASE_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS` to `backend/.env`, then restart the servers.

## Key API endpoint

`POST /api/auth/google` (JSON body `{"idToken":"<Firebase ID token>"}`) — validates Google identity and returns `{success,token,user}` in the same format as the normal backend login. Only customer accounts are created. Existing email/password accounts cannot be silently linked for security.

## Admin control over service images

Admin Panel > Settings > Services > Upload Service Image > Save Changes. Images are read from MongoDB site settings on the public website. There are no mock service responses in React.
