import api from '../lib/axios';
import type { User, PaginatedResponse } from '../types/auth';

export const userService = {
    // Listar usuarios (con paginación)
    getUsers: async (page = 1) => {
        const { data } = await api.get<PaginatedResponse<User>>(`/users?page=${page}`);
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

};