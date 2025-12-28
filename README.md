# PIIRS Client - Public Infrastructure Issue Reporting System

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?style=flat&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=flat&logo=firebase)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A modern, responsive web application that empowers citizens to report and track public infrastructure issues, helping communities build better cities together.

[Live Demo](#) • [Report Bug](https://github.com/jihanurrahman33/PIIRS_CLIENT/issues) • [Request Feature](https://github.com/jihanurrahman33/PIIRS_CLIENT/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#-project-structure)
- [User Roles & Permissions](#-user-roles--permissions)
- [Authentication Flow](#-authentication-flow)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)
- [Contact](#-contact)

---

## 🚀 About The Project

PIIRS (Public Infrastructure Issue Reporting System) is a comprehensive web application designed to streamline the process of reporting, tracking, and resolving public infrastructure issues. The platform connects citizens with municipal staff and administrators to create a transparent and efficient problem-solving ecosystem.

### Why PIIRS?

- **Citizen Empowerment**: Enable residents to easily report infrastructure problems in their community
- **Transparency**: Track the status and progress of reported issues in real-time
- **Efficiency**: Streamline communication between citizens and municipal authorities
- **Accountability**: Role-based dashboards for citizens, staff, and administrators
- **Community Impact**: Foster civic engagement and improve urban living conditions

---

## ✨ Key Features

### For Citizens
- 🔐 **Secure Authentication** - Firebase-powered user authentication with Google Sign-In
- 📝 **Report Issues** - Submit detailed reports with descriptions, categories, and images
- 📊 **Personal Dashboard** - Track all your submitted issues in one place
- 👤 **Profile Management** - Update personal information and preferences
- 🔔 **Issue Tracking** - Monitor the status and resolution progress of your reports

### For Staff Members
- 📋 **Assigned Issues** - View and manage issues assigned to you
- ✅ **Update Status** - Mark issues as in-progress or resolved
- 📈 **Staff Dashboard** - Dedicated workspace for efficient issue management

### For Administrators
- 👥 **User Management** - Manage citizens and staff members
- 📊 **All Issues Overview** - Comprehensive view of all reported issues
- 🔧 **Staff Assignment** - Assign issues to appropriate staff members
- 📈 **Analytics Dashboard** - Monitor system-wide metrics and trends

### Additional Features
- 🎨 **Modern UI/UX** - Clean, responsive design with Tailwind CSS and DaisyUI
- 🌓 **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Optimized with Vite for lightning-fast development and builds
- 🔒 **Role-Based Access Control** - Secure routes with custom authentication guards
- 📱 **Progressive Web App** - Installable as a native-like app

---

## 🛠 Tech Stack

### Core Technologies
- **React 19.2.0** - Modern React with latest features
- **Vite 7.2.4** - Next-generation frontend tooling
- **React Router 7.10.1** - Declarative routing for React applications

### UI & Styling
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **DaisyUI 5.5.8** - Tailwind CSS component library
- **React Icons 5.5.0** - Popular icon library

### State Management & Data Fetching
- **TanStack React Query 5.90.12** - Powerful data synchronization
- **Axios 1.13.2** - Promise-based HTTP client
- **React Hook Form 7.68.0** - Performant form validation

### Authentication & Backend
- **Firebase 12.6.0** - Authentication and hosting
- **Custom Axios Interceptors** - Secure API communication

### Additional Libraries
- **React Toastify 11.0.5** - Toast notifications
- **React Responsive Carousel 3.2.23** - Image carousels
- **React Awesome Slider 4.1.0** - Touch-friendly sliders

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Firebase Account** for authentication services
- **Backend API** running or deployed

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/jihanurrahman33/PIIRS_CLIENT.git
cd PIIRS_CLIENT
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API URL
VITE_API_BASE_URL=https://your-backend-api.com/api

# Image Hosting (if applicable)
VITE_IMAGE_HOSTING_KEY=your_imgbb_api_key
```

> ⚠️ **Security Note**: Never commit your `.env` file. Keep all sensitive credentials secure and use environment-specific configurations for production.

### Running the Application

**Development Mode**

```bash
npm run dev
```

The application will open at `http://localhost:5173`

**Production Build**

```bash
npm run build
```

**Preview Production Build**

```bash
npm run preview
```

**Linting**

```bash
npm run lint
```

---

## 📁 Project Structure

```
PIIRS_CLIENT/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, icons, media files
│   ├── auth/                 # Route protection components
│   │   ├── AdminRoute.jsx    # Admin-only route guard
│   │   ├── PrivateRoute.jsx  # Authenticated user guard
│   │   └── StaffRoute.jsx    # Staff-only route guard
│   ├── components/           # Reusable UI components
│   │   ├── Footer/
│   │   ├── IssueCard/
│   │   ├── IssueDetails/
│   │   ├── Loading/
│   │   ├── Logo/
│   │   └── NavBar/
│   ├── contexts/             # React Context providers
│   │   └── AuthContext/      # Authentication context
│   ├── firebase/             # Firebase configuration
│   │   └── firebase.config.js
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.jsx       # Authentication hook
│   │   ├── useAxios.jsx      # Axios instance hook
│   │   ├── useAxiosSecure.jsx # Secure Axios with auth
│   │   ├── useRole.jsx       # User role management
│   │   └── useUser.jsx       # Current user data
│   ├── layouts/              # Layout components
│   │   ├── DashBoardLayout.jsx
│   │   └── MainLayout.jsx
│   ├── pages/                # Page components
│   │   ├── About/
│   │   ├── Auth/             # Login, Register, etc.
│   │   ├── Contact/
│   │   ├── Dashboard/
│   │   │   ├── Admin/        # Admin dashboard pages
│   │   │   ├── Citizen/      # Citizen dashboard pages
│   │   │   └── Staff/        # Staff dashboard pages
│   │   ├── Error/
│   │   ├── Home/             # Landing page components
│   │   ├── Issues/           # Browse issues
│   │   └── ReportIssue/      # Issue submission form
│   ├── router/               # Application routing
│   │   └── router.jsx
│   ├── App.jsx               # Root component
│   ├── App.css               # Global styles
│   ├── index.css             # Base CSS
│   └── main.jsx              # Application entry point
├── .env                      # Environment variables (not in git)
├── eslint.config.js          # ESLint configuration
├── firebase.json             # Firebase hosting config
├── index.html                # HTML entry point
├── package.json              # Project dependencies
├── README.md                 # Project documentation
└── vite.config.js            # Vite configuration
```

---

## 👥 User Roles & Permissions

### 🟢 Citizen (Default Role)
- Register and create an account
- Report new infrastructure issues
- View and track personal issues
- Update profile information
- Access citizen dashboard

### 🔵 Staff Member
- View assigned issues
- Update issue status (pending → in-progress → resolved)
- Manage workload through staff dashboard
- All citizen permissions

### 🔴 Administrator
- Manage all users (citizens and staff)
- View all reported issues
- Assign issues to staff members
- Promote citizens to staff role
- Access comprehensive analytics
- All staff and citizen permissions

---

## 🔐 Authentication Flow

### Firebase Authentication Integration

```javascript
// 1. User Login
User → Firebase Auth → ID Token Generated

// 2. Token Attachment
const token = await currentUser.getIdToken();
config.headers.Authorization = `Bearer ${token}`;

// 3. API Request
Frontend (with token) → Backend API

// 4. Token Verification
Backend → Verify Firebase Token → Fetch User Data → Return Response

// 5. Authorization Check
Backend checks user role → Grant/Deny access based on permissions
```

### Secure API Calls with `useAxiosSecure`

```jsx
// Automatic token attachment to all requests
const axiosSecure = useAxiosSecure();

// Example usage
const response = await axiosSecure.get('/users/me');
const issues = await axiosSecure.get('/issues');
```

### Protected Routes

```jsx
// Citizen Route
<Route element={<PrivateRoute />}>
  <Route path="/dashboard" element={<CitizenDashboard />} />
</Route>

// Staff Route
<Route element={<StaffRoute />}>
  <Route path="/staff/assigned" element={<AssignedIssues />} />
</Route>

// Admin Route
<Route element={<AdminRoute />}>
  <Route path="/admin/users" element={<ManageUsers />} />
</Route>
```

---

## 🔌 API Integration

### Base Configuration

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **User Management** |
| `GET` | `/users/me` | Fetch current user profile | ✅ |
| `GET` | `/users` | Get all users (admin) | ✅ Admin |
| `POST` | `/users` | Create/update user | ✅ |
| `PATCH` | `/users/:id/role` | Update user role (admin) | ✅ Admin |
| **Issues** |
| `GET` | `/issues` | Fetch all issues | ✅ |
| `GET` | `/issues/:id` | Get issue details | ✅ |
| `POST` | `/issues` | Create new issue | ✅ |
| `PATCH` | `/issues/:id` | Update issue status | ✅ Staff/Admin |
| `DELETE` | `/issues/:id` | Delete issue | ✅ Admin |
| **Dashboard** |
| `GET` | `/issues/my-issues` | User's submitted issues | ✅ |
| `GET` | `/issues/assigned` | Staff assigned issues | ✅ Staff |
| `GET` | `/stats/dashboard` | Dashboard statistics | ✅ |

---

## 🌐 Deployment

### Firebase Hosting (Recommended)

```bash
# Build the project
npm run build

# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init

# Deploy
firebase deploy
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist

# Ensure _redirects file for SPA routing
echo "/* /index.html 200" > dist/_redirects
```

### Environment Variables in Production

Make sure to configure all environment variables in your hosting platform:
- Vercel: Settings → Environment Variables
- Netlify: Site settings → Build & deploy → Environment
- Firebase: Use `.env.production` file (not tracked in git)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Write clean, readable, and maintainable code
- Follow the existing code style and conventions
- Use `react-hook-form` for form validation
- Implement proper error handling and loading states
- Add comments for complex logic
- Test your changes thoroughly before submitting
- Update documentation if needed

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: Application won't start

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Issue: Firebase authentication not working

**Solution:**
- Verify all Firebase environment variables are set correctly
- Check Firebase console for enabled authentication methods
- Ensure authorized domains include your localhost and production URLs

#### Issue: API requests failing with 401 Unauthorized

**Solution:**
- Check if user is logged in: `const { user } = useAuth()`
- Verify token is being attached in `useAxiosSecure` hook
- Check backend is accepting the Firebase token format
- Ensure CORS is configured on the backend

#### Issue: Role-based routes not working

**Solution:**
- Verify user data includes `role` field
- Check `useRole` hook is fetching role correctly
- Ensure backend `/users/me` returns user role
- Clear localStorage and login again

#### Issue: Build errors

**Solution:**
```bash
# Check for ESLint errors
npm run lint

# Build with error details
npm run build --verbose
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 📞 Contact

**Md Jihanur Rahman**

- 📧 Email: [mdjihanurrahman5@gmail.com](mailto:mdjihanurrahman5@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/md-jihanur-rahman](https://www.linkedin.com/in/md-jihanur-rahman/)
- 🐙 GitHub: [@jihanurrahman33](https://github.com/jihanurrahman33)

**Project Link:** [https://github.com/jihanurrahman33/PIIRS_CLIENT](https://github.com/jihanurrahman33/PIIRS_CLIENT)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by [Md Jihanur Rahman](https://github.com/jihanurrahman33)

</div>
