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

// Componente temporal para Edición (mientras creamos el archivo real)
const UserEditPlaceholder = () => (
  <div className="p-6 bg-white rounded shadow">
    <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
    <p>El formulario de edición está en construcción.</p>
  </div>
);

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
      {/* =========================================
          RUTA PÚBLICA (LOGIN)
      ========================================= */}
      <Route path="/" element={<Login />} />

      {/* =========================================
          RUTAS PROTEGIDAS (DASHBOARD)
      ========================================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Inicio del Dashboard */}
        <Route index element={<Home />} />
        
        {/* Perfil del Usuario Logueado */}
        <Route path="profile" element={<Profile />} />

        {/* Gestión de Usuarios */}
        <Route path="users">
            <Route index element={<UsersIndex />} />          {/* Lista: /dashboard/users */}
            <Route path="create" element={<UserCreate />} />  {/* Crear: /dashboard/users/create */}
            <Route path=":id/edit" element={<UserEditPlaceholder />} /> {/* Editar: /dashboard/users/1/edit */}
        </Route>

        {/* Agrega aquí más rutas (ej. documentos, reportes) */}
      </Route>

      {/* =========================================
          RUTAS NO ENCONTRADAS (404)
      ========================================= */}
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