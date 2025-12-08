import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import api from '../lib/axios';
import type  { User, LoginResponse } from '../types/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: LoginResponse) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Efecto para recuperar la sesión si recargas la página
    // NOTA: Idealmente deberías tener un endpoint /api/auth/me para validar el token al iniciar
    // Por ahora, confiaremos en que si hay token y usuario guardado en storage, es válido.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = (responseData: LoginResponse) => {
        const { access_token, user } = responseData.data;

        // Guardar en estado
        setToken(access_token);
        setUser(user);

        // Guardar en LocalStorage para persistencia
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = async () => {
        try {
            // Llamada al backend para invalidar token
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Error al cerrar sesión en servidor", error);
        } finally {
            // Limpieza local independientemente de si el server respondió bien
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
};