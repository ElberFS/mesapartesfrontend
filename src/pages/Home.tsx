// src/pages/Home.tsx
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Área Asignada</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{user?.area?.name}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Rol del Sistema</h3>
                    <div className="mt-2">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {user?.roles[0]?.name || 'Sin rol'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}