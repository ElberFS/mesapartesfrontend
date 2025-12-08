import api from '../lib/axios';
import type { User } from '../types/auth';

export const authService = {
    // Login y Logout ya los tienes en AuthContext, pero el perfil va aquí

    // Actualizar datos del perfil (PUT /api/auth/profile)
    updateProfile: async (data: Partial<User>) => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    // Cambiar contraseña (PUT /api/auth/password)
    updatePassword: async (data: { current_password: string; password: string; password_confirmation: string }) => {
        const response = await api.put('/auth/password', data);
        return response.data;
    }
};