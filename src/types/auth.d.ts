// Definición del Área
export interface Area {
    id: number;
    name: string;
    code: string;
}

// Definición del Rol (Puede ser string o objeto dependiendo de tu recurso Laravel)
export interface Role {
    id: number;
    name: string;
}

// Definición del Usuario Completo
export interface User {
    id: number;
    username: string;
    first_name: string;
    paternal_surname: string;
    maternal_surname: string;
    full_name: string;
    dni: string;
    email: string;
    phone: string | null;
    address: string | null;
    position: string;
    is_active: boolean;
    hire_date?: string | null;

    // Relaciones
    area: Area;
    roles: any[]; // Usamos any[] por flexibilidad, o Role[] si tu API devuelve objetos
    permissions: string[]; // Lista de permisos: ["crear-usuarios", "ver-reportes"]
}

// === ESTA ES LA INTERFAZ QUE TE FALTABA ===
export interface LoginResponse {
    status: string;
    message: string;
    data: {
        user: User;
        access_token: string;
        token_type: string;
    };
}

// Respuesta paginada (para la tabla de usuarios)
export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}