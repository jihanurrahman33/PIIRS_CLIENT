```md
# Frontend — Public Infrastructure Reporting (Client)

> Frontend for the Public Infrastructure Reporting system — a React single-page application that allows users to report issues, manage their reports, edit their profile, and upgrade to Premium using Stripe Checkout.

---

## 📌 Table of Contents
- [Project Overview](#project-overview)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Repository Structure](#repository-structure)  
- [Environment Variables](#environment-variables)  
- [Local Development](#local-development)  
- [Build & Deploy](#build--deploy)  
- [Auth & API Flow](#auth--api-flow)  
- [Stripe Payment Flow](#stripe-payment-flow)  
- [Frontend-Used API Endpoints](#frontend-used-api-endpoints)  
- [Troubleshooting](#troubleshooting)  
- [Contributing](#contributing)  
- [Maintainer Info](#maintainer-info)

---

# Project Overview
This frontend provides a user-friendly interface for reporting public infrastructure issues.  
Key features include:

- 🔐 Firebase authentication  
- 👤 User profile management  
- 📝 Issue creation & management  
- ⭐ Premium subscription using Stripe Checkout  
- 📸 Image upload & issue tracking  
- 📊 Dashboard for personal reports  

The frontend communicates with a secure backend API that manages all user, issue, and payment operations.

---

# Tech Stack
- **React** (Hooks)
- **React Router**
- **React Hook Form**
- **Axios + Custom Secure Instance (`useAxiosSecure`)**
- **Firebase Authentication**
- **Stripe Checkout**
- **Tailwind CSS + DaisyUI**
- **React Toastify**

---

# Prerequisites
Before running the project, ensure you have:

- Node.js (v16+)  
- A configured Firebase project  
- Backend server running or deployed  
- Stripe account (for Premium checkout)

---

# Repository Structure
```

src/
components/
Header.jsx
IssueCard.jsx
IssueForm.jsx
pages/
Profile.jsx
Dashboard/
MyIssues.jsx
IssueDetails.jsx
Auth/
Login.jsx
Signup.jsx
hooks/
useAuth.js
useAxiosSecure.js
services/
api.js
App.jsx
main.jsx

````

---

# Environment Variables
Create a `.env` file with:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Backend URL
VITE_API_BASE_URL=https://your-backend-url.com

# Stripe (public key)
VITE_STRIPE_PUBLIC_KEY=
````

⚠️ **Do NOT include Stripe secret key or Firebase service account on frontend.**

---

# Local Development

### Install dependencies

```bash
npm install
# or
yarn
```

### Start development server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# Build & Deploy

### Production build

```bash
npm run build
```

### Deploy options

* **Vercel** (recommended)
* **Netlify**
* **Firebase Hosting**
* Any static hosting (ensure SPA routing → fallback to index.html)

---

# Auth & API Flow

### 1️⃣ Firebase Authentication

* User logs in → Firebase issues ID token.
* `useAuth()` exposes:

  ```js
  { user, logOut }
  ```

### 2️⃣ Secure API Calls

All authenticated requests use `useAxiosSecure`:

```js
axiosSecure.interceptors.request.use(async (config) => {
  const token = await currentUser.getIdToken();  
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 3️⃣ Backend Authorization

Backend verifies Firebase token → maps to DB user → returns user data.

---

# Stripe Payment Flow

### Step-by-step:

1. User clicks **Subscribe**
2. Frontend calls:

   ```js
   POST /create-checkout-session
   ```
3. Backend returns Stripe URL → frontend redirects
4. After payment, Stripe redirects user back:

   ```
   /profile?session_id=xxx
   ```
5. Frontend calls:

   ```js
   PATCH /payment-success?session_id=xxx
   ```
6. Backend verifies & updates user:

   ```json
   { "success": true }
   ```
7. Frontend re-fetches:

   * `/users/me`
   * `/users/me/issue-count`
     and updates subscription status.

---

# Frontend-Used API Endpoints

| Method | Endpoint                   | Description                                            |
| ------ | -------------------------- | ------------------------------------------------------ |
| GET    | `/users/me`                | Fetch logged-in user record (must include `isPremium`) |
| POST   | `/users`                   | Update user profile                                    |
| GET    | `/users/me/issue-count`    | Returns `{ count, limit, isPremium }`                  |
| POST   | `/create-checkout-session` | Begins Stripe checkout                                 |
| PATCH  | `/payment-success`         | Verifies Stripe payment session                        |
| GET    | `/issues`                  | Fetch issues (by email/query)                          |
| GET    | `/issues/:id`              | Get issue details                                      |
| POST   | `/issues`                  | Create new issue                                       |

---

# Troubleshooting

### ❗ After buying premium, user shows “Free” after reload

* Ensure `/users/me` returns:

  ```json
  { "isPremium": true }
  ```
* Check DevTools → Network
* Verify request includes:

  ```
  Authorization: Bearer <FirebaseToken>
  ```
* Check webhook/payment-success correctly updates DB
* Ensure frontend waits for Firebase auth before calling backend

---

# Contributing

* Write clean, modular components
* Use `react-hook-form` for form handling
* Keep API calls inside hooks or service files
* Enable linting + Prettier for formatting

---

# Maintainer Info

**Md Jihanur Rahman**
📧 `mdjihanurrahman5@gmail.com`
🔗 LinkedIn: [https://www.linkedin.com/in/md-jihanur-rahman/](https://www.linkedin.com/in/md-jihanur-rahman/)

---
