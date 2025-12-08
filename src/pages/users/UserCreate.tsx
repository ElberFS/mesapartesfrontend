import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

// Areas de ejemplo (deberían venir de una API)
const AREAS = [
    { id: 1, name: 'Gerencia General' },
    { id: 5, name: 'Mesa de Partes' },
    // Agrega las que uses
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
        position: '',
        area_id: '',
        role: 'secretaria', // Valor por defecto
        is_active: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // CORRECCIÓN: Se cambió .create() por .createUser()
            await userService.createUser(form);
            navigate('/dashboard/users');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error del servidor');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Registrar Nuevo Usuario</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Grid para datos personales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Nombres</label>
                        <input name="first_name" className="input-field" onChange={handleChange} required />
                        {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                    </div>
                    <div>
                        <label className="label">Apellido Paterno</label>
                        <input name="paternal_surname" className="input-field" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="label">Apellido Materno</label>
                        <input name="maternal_surname" className="input-field" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="label">DNI</label>
                        <input name="dni" className="input-field" onChange={handleChange} maxLength={8} required />
                        {errors.dni && <p className="text-red-500 text-xs">{errors.dni}</p>}
                    </div>
                </div>

                {/* Datos de cuenta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <label className="label">Usuario (Login)</label>
                        <input name="username" className="input-field" onChange={handleChange} required />
                        {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input name="email" type="email" className="input-field" onChange={handleChange} />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="label">Contraseña</label>
                        <input name="password" type="password" className="input-field" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="label">Confirmar Contraseña</label>
                        <input name="password_confirmation" type="password" className="input-field" onChange={handleChange} required />
                    </div>
                </div>

                {/* Datos laborales */}
                <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Cargo</label>
                            <input name="position" className="input-field" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="label">Área</label>
                            <select name="area_id" className="input-field" onChange={handleChange} required>
                                <option value="">Seleccione Área</option>
                                {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Rol del Sistema</label>
                            <select name="role" className="input-field" onChange={handleChange} value={form.role}>
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Administrador</option>
                                <option value="jefe">Jefe</option>
                                <option value="secretaria">Secretaria</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button type="button" onClick={() => navigate(-1)} className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 rounded">Cancelar</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {loading ? 'Guardando...' : 'Guardar Usuario'}
                    </button>
                </div>
            </form>

            {/* Estilos locales para inputs */}
            <style>{`
         .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
         .input-field { width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; outline: none; transition: border-color 0.15s; }
         .input-field:focus { border-color: #2563eb; ring: 2px; }
       `}</style>
        </div>
    );
}