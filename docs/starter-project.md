3️⃣ Install Dependencies
Core
npm install react-router-dom axios zustand

Form & Validation
npm install react-hook-form zod @hookform/resolvers

UX
npm install react-hot-toast clsx

Auth & Utils
npm install jwt-decode

Data Fetching (recommended)
npm install @tanstack/react-query

4️⃣ Tailwind Setup
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

5️⃣ Folder Structure (Recommended)
src/
├─ app/
│  ├─ router.jsx
│  ├─ queryClient.js
│
├─ components/
│  ├─ ui/
│  ├─ layout/
│
├─ features/
│  ├─ auth/
│  │  ├─ auth.store.js
│  │  ├─ auth.api.js
│  │  └─ auth.schema.js
│
├─ stores/
│  └─ app.store.js
│
├─ services/
│  ├─ axios.js
│
├─ hooks/
├─ utils/
├─ App.jsx
└─ main.jsx


💡 Pattern ini cocok banget buat SmashClub karena mudah di-scale (auth, booking, match, payment, dll)

6️⃣ Zustand Store Example
src/features/auth/auth.store.js
import { create } from "zustand"

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false
    })
}))

7️⃣ Axios Instance
src/services/axios.js
import axios from "axios"
import { useAuthStore } from "../features/auth/auth.store"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

8️⃣ Router Setup
src/app/router.jsx
import { createBrowserRouter } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <Dashboard /> }
])

main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

9️⃣ Optional tapi Highly Recommended

🔐 ProtectedRoute component

💾 Persist Zustand (zustand/middleware)

🎭 Role & Permission Guard

🌍 i18n (kalau multi bahasa)

🧪 Vitest + Testing Library