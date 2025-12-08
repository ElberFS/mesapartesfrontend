import api from '../lib/axios';
import type { User, PaginatedResponse } from '../types/auth';

export const userService = {
    // Listar usuarios (con paginación y búsqueda opcional)
    getUsers: async (params?: { page?: number; search?: string }) => {
        const page = params?.page || 1;
        const search = params?.search ? `&search=${params.search}` : '';
        const { data } = await api.get<PaginatedResponse<User>>(`/users?page=${page}${search}`);
        return data;
    },

    // Crear usuario
    createUser: async (userData: Partial<User>) => {
        const { data } = await api.post('/users', userData);
        return data;
    },

    // Obtener un usuario por ID
    getUserById: async (id: number) => {
        const { data } = await api.get<{ data: User }>(`/users/${id}`);
        return data;
    },

    // Actualizar usuario
    updateUser: async (id: number, userData: Partial<User>) => {
        const { data } = await api.put(`/users/${id}`, userData);
        return data;
    },

    // Eliminar usuario
    deleteUser: async (id: number) => {
        const { data } = await api.delete(`/users/${id}`);
        return data;
    },

    
    // Activar usuario
    activateUser: async (id: number) => {
        // Asumiendo ruta: Route::put('/users/{user}/activate', ...)
        const { data } = await api.put(`/users/${id}/activate`); 
        return data;
    },

    // Desactivar usuario
    deactivateUser: async (id: number) => {
        const { data } = await api.put(`/users/${id}/deactivate`); 
        return data;
    }
};