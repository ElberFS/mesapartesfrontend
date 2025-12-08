import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Auth
import Login from './pages/Login';

// Pages - Dashboard General
import Home from './pages/Home';
import Profile from './pages/profile/Profile';

// Pages - Usuarios
import UsersIndex from './pages/users/UsersIndex';
import UserCreate from './pages/users/UserCreate';
import UserEdit from './pages/users/UserEdit'; 

// Componente de protección de rutas
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Cargando sistema...</div>;
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route index element={<Home />} />

        <Route path="profile" element={<Profile />} />

        <Route path="users">
            <Route index element={<UsersIndex />} />          
            <Route path="create" element={<UserCreate />} />  

            <Route path=":id/edit" element={<UserEdit />} />  
        </Route>

      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;