import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { useAuthStore } from './features/auth/auth.store'
import { checkAuth } from './features/auth/auth.api'
import AlertModal from './components/ui/AlertModal/AlertModal'
import ConfirmModal from './components/ui/ConfirmModal/ConfirmModal'
import './index.css'

const AppBootstrap = () => {
  const { login, logout, token } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const response = await checkAuth();
        if (response.success) {
          login({
            fullname: response.data.fullname,
            username: response.data.username,
            adminRole: response.data.adminRole,
            profilePicture: response.data.profilePicture,
          }, response.data.accessToken);
        } else {
          logout();
        }
      }
    };

    initAuth();
  }, [token]);

  return (
    <>
      <RouterProvider router={router} />
      <AlertModal />
      <ConfirmModal />
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>,
)
