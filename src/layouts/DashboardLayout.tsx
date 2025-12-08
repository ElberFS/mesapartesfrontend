import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Estados para el Sidebar y el Menú de Usuario
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // Referencia para detectar clics fuera del menú y cerrarlo
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Cerrar el menú si se hace clic fuera de él
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Menú de navegación lateral
    const navigation = [
        { name: 'Inicio', href: '/dashboard', icon: '🏠' },
        { name: 'Usuarios', href: '/dashboard/users', icon: '👥', permission: 'ver-usuarios' },
        { name: 'Documentos', href: '/dashboard/documents', icon: '📄', permission: 'ver-documento' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar Lateral */}
            <aside
                className={`bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                    } flex flex-col fixed h-full z-20`}
            >
                <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-900">
                    <span className="font-bold text-xl truncate px-2">
                        {sidebarOpen ? 'Mesa Partes' : 'MDP'}
                    </span>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navigation.map((item) => {
                        // Verificar permisos
                        if (item.permission && !user?.permissions.includes(item.permission)) {
                            return null;
                        }

                        return (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                end={item.href === '/dashboard'}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                <span className="text-xl">{item.icon}</span>
                                {sidebarOpen && <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>}
                            </NavLink>
                        );
                    })}
                </nav>
                
                {/* ELIMINADO: El botón de salir ya no está aquí */}
            </aside>

            {/* Contenido Principal */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>

                {/* Header Superior */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
                    >
                        <span className="text-xl">☰</span>
                    </button>

                    {/* Menú de Usuario (Dropdown) */}
                    <div className="relative ml-3" ref={userMenuRef}>
                        <div>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 focus:outline-none p-1 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                                    <p className="text-xs text-gray-500">{user?.position}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
                                    {user?.first_name?.charAt(0)}{user?.paternal_surname?.charAt(0)}
                                </div>
                                {/* Flechita indicadora */}
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                        </div>

                        {/* El Dropdown flotante */}
                        {userMenuOpen && (
                            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down">
                                <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                                </div>
                                
                                <Link
                                    to="/dashboard/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    👤 Mi Perfil
                                </Link>
                                
                                <button
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    🚪 Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Contenido de las páginas */}
                <main className="flex-1 p-6 overflow-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}