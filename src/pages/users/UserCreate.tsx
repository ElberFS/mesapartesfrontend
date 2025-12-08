import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { Save, ArrowLeft, Loader2,  User, Mail, Lock, Briefcase, Phone, MapPin } from 'lucide-react';

// Áreas de ejemplo
const AREAS = [
    { id: 1, name: 'Gerencia General' },
    { id: 5, name: 'Mesa de Partes' },
];

export default function UserCreate() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const [form, setForm] = useState({
        username: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        paternal_surname: '',
        maternal_surname: '',
        dni: '',
        email: '',
        phone: '',
        address: '',
        position: '',
        area_id: '',
        role: 'secretaria',
        is_active: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // === SOLUCIÓN AL ERROR DE TYPESCRIPT ===
            // Convertimos area_id a número antes de enviar
            const payload = {
                ...form,
                area_id: form.area_id ? parseInt(form.area_id) : undefined
            };

            // Usamos 'as any' para evitar conflictos estrictos entre la interfaz User y el payload de creación
            await userService.createUser(payload as any);
            
            navigate('/dashboard/users');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert('Ocurrió un error al procesar la solicitud.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Limpiar error específico si existe
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/users" className="text-gray-500 hover:text-gray-700 transition">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Usuario</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECCIÓN 1: Datos Personales */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Información Personal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                                <input 
                                    name="dni" 
                                    className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.dni ? 'border-red-500' : 'border-gray-300'}`}
                                    onChange={handleChange} 
                                    maxLength={8} 
                                    required 
                                />
                                {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                                <input 
                                    name="first_name" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange} 
                                    required 
                                />
                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                                <input 
                                    name="paternal_surname" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange} 
                                    required 
                                />
                                {errors.paternal_surname && <p className="text-red-500 text-xs mt-1">{errors.paternal_surname}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                                <input 
                                    name="maternal_surname" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange} 
                                    required 
                                />
                                {errors.maternal_surname && <p className="text-red-500 text-xs mt-1">{errors.maternal_surname}</p>}
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* SECCIÓN 2: Cuenta de Usuario */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Lock size={20} className="text-blue-600" />
                            Cuenta y Seguridad
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (Login)</label>
                                <input 
                                    name="username" 
                                    className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                                    onChange={handleChange} 
                                    required 
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input 
                                        name="email" 
                                        type="email" 
                                        className={`w-full pl-10 border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        onChange={handleChange} 
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <input 
                                    name="password" 
                                    type="password" 
                                    className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    onChange={handleChange} 
                                    required 
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                                <input 
                                    name="password_confirmation" 
                                    type="password" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* SECCIÓN 3: Datos Laborales */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-blue-600" />
                            Datos Laborales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Posición</label>
                                <input 
                                    name="position" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                                <select 
                                    name="area_id" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Seleccione Área</option>
                                    {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol del Sistema</label>
                                <select 
                                    name="role" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    onChange={handleChange} 
                                    value={form.role}
                                >
                                    <option value="superadmin">Super Admin</option>
                                    <option value="admin">Administrador</option>
                                    <option value="jefe">Jefe</option>
                                    <option value="secretaria">Secretaria</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input 
                                        name="phone" 
                                        className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input 
                                        name="address" 
                                        className="w-full pl-10 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className="mr-3 px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium disabled:opacity-70 shadow-sm"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {loading ? 'Guardando...' : 'Registrar Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}