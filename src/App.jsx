import { Paper } from '@mantine/core';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader.jsx';
import { useAuthStore } from './store/auth.js';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import '@mantine/core/styles.css';

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
}

function PublicLayout() {
  return (
    <>
      <Paper component="header" h={64} radius={0} withBorder>
        <AppHeader />
      </Paper>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
