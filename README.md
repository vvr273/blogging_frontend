# Blogging Frontend

React + Vite frontend for a blogging platform with:
- email/password auth
- Google login
- email verification + password reset
- protected dashboard
- blog CRUD, likes, and comments
- profile settings
- water counter + todo utilities on dashboard

## Tech Stack

- React 19
- React Router
- Axios
- Vite
- Google OAuth (`@react-oauth/google`)

## Project Structure

```text
blogging_frontend/
  src/
    api/            # API clients for auth, blogs, profile
    hooks/          # auto-logout hook
    context/        # blog context/provider
    App.jsx         # app routes
    main.jsx        # app bootstrap + Google provider
  pages/            # auth/dashboard/blog/settings pages
  components/       # shared UI components
```

## Environment Variables

Create a `.env` file in `blogging_frontend/`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Note: this key name is intentionally VITE_API_UR_auth (matches current code)
VITE_API_UR_auth=http://localhost:5000/api/auth
VITE_API_URL_blog=http://localhost:5000/api/blogs
VITE_API_URL_profile=http://localhost:5000/api/profile
```

## Install & Run

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:5173`

## Available Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Routing Overview

Public routes:
- `/`, `/login`, `/register`
- `/about`
- `/verify/:token`
- `/forgot-password`
- `/reset-password/:token`
- `/blogs`

Protected routes:
- `/dashboard`
- `/settings`
- `/blog/:id`
- `/blogs/create`
- `/blogs/edit/:id`

## API Integration

The frontend expects backend endpoints under:
- `/api/auth`
- `/api/blogs`
- `/api/profile`

Auth token is stored in `localStorage` as `token` and sent as `Authorization: Bearer <token>` for protected requests.

## Notes

- Auto logout is currently set to `15 minutes` of inactivity (`useAutoLogout`).
- Google login in `components/GoogleSignIn.jsx` currently calls a hardcoded deployed backend URL; if you want fully local development, align it with your local backend URL.
