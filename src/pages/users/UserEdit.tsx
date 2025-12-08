import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

// Áreas de ejemplo (deberían venir de una API)
const AREAS = [
    { id: 1, name: 'Gerencia General' },
    { id: 5, name: 'Mesa de Partes' },
];

export default function UserEdit() {
    const { id } = useParams();
    // Hook de navegación necesario para el botón Cancelar
    const navigate = useNavigate();
    
    // Estados de carga
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estado del formulario
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        paternal_surname: '',
        maternal_surname: '',
        dni: '',
        email: '',
        phone: '',
        address: '',
        position: '',
        role: '', 
        area_id: '', 
        is_active: true
    });

    // Cargar datos al montar el componente
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (!id) return;
                const response = await userService.getUserById(parseInt(id));
                const user = response.data;
                
                // Lógica para obtener el ID del área correctamente
                let areaIdValue = '';
                if (user.area?.id) {
                    areaIdValue = user.area.id.toString();
                } else if (user.area_id) {
                    areaIdValue = user.area_id.toString();
                }

                setFormData({
                    username: user.username || '',
                    first_name: user.first_name || '',
                    paternal_surname: user.paternal_surname || '',
                    maternal_surname: user.maternal_surname || '',
                    dni: user.dni || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    position: user.position || '',
                    role: user.roles && user.roles.length > 0 ? user.roles[0].name : '', 
                    area_id: areaIdValue,
                    is_active: !!user.is_active
                });
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar la información del usuario.');
            } finally {
                setLoadingData(false);
            }
        };

        loadUser();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (!id) return;

            // Convertimos area_id a número
            const payload = {
                ...formData,
                area_id: formData.area_id ? parseInt(formData.area_id) : undefined
            };

            await userService.updateUser(parseInt(id), payload as any);
            
            navigate('/dashboard/users');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar el usuario.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loadingData) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-500">Cargando datos del usuario...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/users" className="text-gray-500 hover:text-gray-700 transition">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Usuario</h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-200">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECCIÓN 1: Identificación */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (Login)</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                            <input
                                type="text"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                maxLength={8}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ap. Paterno</label>
                                <input
                                    type="text"
                                    name="paternal_surname"
                                    value={formData.paternal_surname}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ap. Materno</label>
                                <input
                                    type="text"
                                    name="maternal_surname"
                                    value={formData.maternal_surname}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: Contacto */}
                    <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* SECCIÓN 3: Sistema (Roles y Áreas) */}
                    <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol del Sistema</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                <option value="">Seleccionar Rol</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Administrador</option>
                                <option value="jefe">Jefe</option>
                                <option value="secretaria">Secretaria</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                name="is_active"
                                value={formData.is_active ? '1' : '0'}
                                onChange={(e) => setFormData({...formData, is_active: e.target.value === '1'})}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                            <select
                                name="area_id"
                                value={formData.area_id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                <option value="">Seleccione Área</option>
                                {AREAS.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Posición</label>
                             <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Footer con botones de acción */}
                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        {/* Botón Cancelar agregado aquí */}
                        <button
                            type="button"
                            onClick={() => navigate(-1)} // Vuelve a la página anterior
                            className="mr-3 px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm"
                            disabled={saving}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium disabled:opacity-70 shadow-sm"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}