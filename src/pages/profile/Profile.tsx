import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
// Importamos iconos para mejorar la interfaz visual
import { User, Mail, Phone, MapPin, Lock, Key, Shield, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Estados para datos personales
    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    // Estados para contraseña
    const [passData, setPassData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            await authService.updateProfile(formData);
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Error al actualizar perfil' });
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (passData.password !== passData.password_confirmation) {
            setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
            return;
        }
        try {
            await authService.updatePassword(passData);
            setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
            setPassData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error al cambiar contraseña' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header de la Página */}
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">Configuración de Cuenta</h1>
                    <p className="mt-2 text-gray-600">Administra tu información personal y seguridad.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Navegación de Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50/50">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex items-center gap-2 flex-1 justify-center py-4 text-sm font-medium transition-all duration-200 ${
                                activeTab === 'info'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                            }`}
                        >
                            <User size={18} />
                            Información Personal
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex items-center gap-2 flex-1 justify-center py-4 text-sm font-medium transition-all duration-200 ${
                                activeTab === 'password'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                            }`}
                        >
                            <Shield size={18} />
                            Seguridad
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Mensajes de Alerta */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <p className="font-medium">{message.text}</p>
                            </div>
                        )}

                        {activeTab === 'info' ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Campos de Solo Lectura con estilo distintivo */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input type="text" value={user?.username} disabled className="pl-10 block w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed sm:text-sm py-2.5" />
                                            <Lock className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">DNI</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <div className="h-5 w-5 flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-400 rounded">ID</div>
                                            </div>
                                            <input type="text" value={user?.dni} disabled className="pl-10 block w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed sm:text-sm py-2.5" />
                                            <Lock className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
                                        </div>
                                    </div>
                                </div>

                                {/* Campos Editables */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 border"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 border"
                                                placeholder="+51 999 999 999"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 border"
                                                placeholder="Av. Principal 123"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end border-t border-gray-100">
                                    <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                                        <Save size={18} />
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleChangePassword} className="max-w-xl mx-auto space-y-6 py-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={passData.current_password}
                                            onChange={e => setPassData({ ...passData, current_password: e.target.value })}
                                            className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 border"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="grid gap-6">
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={passData.password}
                                                    onChange={e => setPassData({ ...passData, password: e.target.value })}
                                                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 border"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-green-600" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={passData.password_confirmation}
                                                    onChange={e => setPassData({ ...passData, password_confirmation: e.target.value })}
                                                    className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm py-2.5 border"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm font-medium">
                                        <Save size={18} />
                                        Actualizar Contraseña
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}