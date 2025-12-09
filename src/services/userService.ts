// src/services/userService.ts
import api from '../lib/axios';
import type { User, PaginatedResponse } from '../types/auth';

let usersCache: PaginatedResponse<User> | null = null;

export const userService = {
    getUsers: async (params?: { page?: number; search?: string }) => {
        const page = params?.page || 1;
        const search = params?.search || '';

        if (page === 1 && !search && usersCache) {
            return usersCache; 
        }

        const querySearch = search ? `&search=${search}` : '';
        const { data } = await api.get<PaginatedResponse<User>>(`/users?page=${page}${querySearch}`);
        
        if (page === 1 && !search) {
            usersCache = data;
        }

        return data;
    },

    createUser: async (userData: Partial<User>) => {
        const { data } = await api.post('/users', userData);
        usersCache = null; // <--- Invalidamos caché
        return data;
    },

    getUserById: async (id: number) => {
        const { data } = await api.get<{ data: User }>(`/users/${id}`);
        return data;
    },

    updateUser: async (id: number, userData: Partial<User>) => {
        const { data } = await api.put(`/users/${id}`, userData);
        usersCache = null; // <--- Invalidamos caché
        return data;
    },

    deleteUser: async (id: number) => {
        const { data } = await api.delete(`/users/${id}`);
        usersCache = null; // <--- Invalidamos caché
        return data;
    },

    activateUser: async (id: number) => {
        const { data } = await api.put(`/users/${id}/activate`); 
        usersCache = null; // <--- Invalidamos caché
        return data;
    },

    deactivateUser: async (id: number) => {
        const { data } = await api.put(`/users/${id}/deactivate`); 
        usersCache = null; // <--- Invalidamos caché
        return data;
    },
    
    invalidateCache: () => {
        usersCache = null;
    }
};