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

// 1. COMPONENTE DE PROTECCIÓN DE AUTENTICACIÓN (LOGIN)
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Cargando sistema...</div>;
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 2. NUEVO: COMPONENTE DE PROTECCIÓN DE PERMISOS (ROLES)
// Este componente verifica si el usuario tiene el permiso específico para ver la página
const PermissionRoute = ({ 
  children, 
  requiredPermission 
}: { 
  children: ReactNode; 
  requiredPermission: string 
}) => {
  const { user } = useAuth();

  // Si no hay usuario cargado aún o no tiene el permiso requerido
  if (user && !user.permissions.includes(requiredPermission)) {
    // Lo redirigimos al inicio del dashboard porque no tiene autorización
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Rutas Protegidas por Login */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Home y Profile suelen ser accesibles para todos los logueados */}
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />

        {/* MÓDULO DE USUARIOS - AHORA CON PROTECCIÓN DE PERMISOS */}
        <Route path="users">
            
            {/* Solo quien tenga 'ver-usuarios' puede ver la lista */}
            <Route index element={
                <PermissionRoute requiredPermission="ver-usuarios">
                    <UsersIndex />
                </PermissionRoute>
            } />          
            
            {/* Solo quien tenga 'crear-usuarios' puede ver el formulario de crear */}
            <Route path="create" element={
                <PermissionRoute requiredPermission="crear-usuarios">
                    <UserCreate />
                </PermissionRoute>
            } />   

            {/* Solo quien tenga 'editar-usuarios' puede entrar a editar */}
            <Route path=":id/edit" element={
                <PermissionRoute requiredPermission="editar-usuarios">
                    <UserEdit />
                </PermissionRoute>
            } />   
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