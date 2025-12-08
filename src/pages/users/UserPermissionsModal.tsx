import { useState } from 'react';
import { Shield, X, UserCheck, UserX, Briefcase, Key, Loader2 } from 'lucide-react';
import type { User } from '../../types/auth';
import { userService } from '../../services/userService';

interface UserPermissionsModalProps {
    user: User | null;
    onClose: () => void;
    onUserUpdated?: () => void; // Callback para recargar la tabla
}

export default function UserPermissionsModal({ user, onClose, onUserUpdated }: UserPermissionsModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!user) return null;

    // Obtener el nombre del rol de forma segura
    const roleName = user.roles && user.roles.length > 0 ? user.roles[0].name : 'Sin Rol';

    const handleToggleStatus = async () => {
        if (!window.confirm(`¿Estás seguro de que deseas ${user.is_active ? 'desactivar' : 'activar'} a este usuario?`)) return;
        
        setIsLoading(true);
        try {
            if (user.is_active) {
                await userService.deactivateUser(user.id);
            } else {
                await userService.activateUser(user.id);
            }
            // Notificar al padre para recargar datos y cerrar modal
            if (onUserUpdated) onUserUpdated();
            onClose();
        } catch (error) {
            console.error('Error cambiando estado', error);
            alert('Error al cambiar el estado del usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    {/* Header con Estado Visual */}
                    <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b ${user.is_active ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${user.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                        {user.full_name}
                                    </h3>
                                    <p className={`text-sm font-medium ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                        {user.is_active ? 'Usuario Activo' : 'Usuario Inactivo'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-4 space-y-4">
                        {/* Información de Rol y Área */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Key size={14} />
                                    <span className="text-xs font-semibold uppercase">Rol del Sistema</span>
                                </div>
                                <div className="font-medium text-gray-800 capitalize">
                                    {roleName}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Briefcase size={14} />
                                    <span className="text-xs font-semibold uppercase">Área</span>
                                </div>
                                <div className="font-medium text-gray-800">
                                    {user.area?.name || 'General'}
                                </div>
                            </div>
                        </div>

                        {/* Lista de Permisos */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Permisos Asignados</p>
                            <div className="bg-gray-50 rounded-md p-3 max-h-48 overflow-y-auto border border-gray-200">
                                {user.permissions && user.permissions.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.permissions.map((perm: any, index: number) => (
                                            <span 
                                                key={index} 
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                            >
                                                {typeof perm === 'string' ? perm : perm.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic text-center py-2">Este usuario no tiene permisos asignados directamente.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer con Botones de Acción */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                        <button
                            type="button"
                            className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-md border shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:text-sm ${
                                user.is_active 
                                    ? 'bg-red-600 hover:bg-red-700 border-transparent' 
                                    : 'bg-green-600 hover:bg-green-700 border-transparent'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleToggleStatus}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : (user.is_active ? <UserX size={16} /> : <UserCheck size={16} />)}
                            {isLoading ? 'Procesando...' : (user.is_active ? 'Desactivar Usuario' : 'Activar Usuario')}
                        </button>

                        <button
                            type="button"
                            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}