import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import type { User } from '../../types/auth';
import { 
    Plus, Search, Edit2, Trash2, 
    ChevronLeft, ChevronRight 
} from 'lucide-react';

// YA NO IMPORTAMOS EL MODAL
// import UserPermissionsModal from '../../components/users/UserPermissionsModal'; 

export default function UsersIndex() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    
    // YA NO NECESITAMOS ESTE ESTADO
    // const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { user: currentUser } = useAuth();

    useEffect(() => {
        loadUsers();
    }, [page]); 

    const loadUsers = async (search = searchTerm) => {
        setLoading(true);
        try {
            const response = await userService.getUsers({ page, search });
            setUsers(response.data);
            setTotalPages(response.meta?.last_page || 1); 
        } catch (error) {
            console.error("Error cargando usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadUsers(searchTerm);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await userService.deleteUser(id);
            loadUsers(); 
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
                    <p className="text-sm text-gray-500">Administra el acceso y roles del sistema.</p>
                </div>

                {currentUser?.permissions.includes('crear-usuarios') && (
                    <Link
                        to="/dashboard/users/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={20} />
                        <span>Nuevo Usuario</span>
                    </Link>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o DNI..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition">
                        Buscar
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Cargando datos...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol / Área</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length > 0 ? users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                    {u.full_name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{u.full_name}</div>
                                                    <div className="text-sm text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium capitalize">
                                                {u.roles && u.roles.length > 0 ? u.roles[0].name : 'Sin Rol'}
                                            </div>
                                            <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">
                                                {u.area?.name || 'General'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {u.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-center gap-2">
                                                
                                                {/* BOTÓN "VER PERMISOS" ELIMINADO */}

                                                <Link 
                                                    to={`/dashboard/users/${u.id}/edit`} 
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                {currentUser?.permissions.includes('eliminar-usuarios') && (
                                                    <button 
                                                        onClick={() => handleDelete(u.id)} 
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Anterior</button>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Siguiente</button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL ELIMINADO */}
        </div>
    );
}