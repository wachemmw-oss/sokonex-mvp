import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Flag, Settings, ArrowLeft, ShieldAlert, Grid } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const menuItems = [
        { name: 'Vue d\'ensemble', path: '/admin', icon: LayoutDashboard },
        { name: 'Utilisateurs', path: '/admin/users', icon: Users },
        { name: 'Signalements', path: '/admin/reports', icon: Flag },
        { name: 'Paramètres', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1A3620] text-white flex flex-col shrink-0 shadow-xl">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <span className="font-extrabold text-xl tracking-tighter">SOKONEX <span className="text-[#FFBA34]">ADMIN</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items - center gap - 3 px - 4 py - 3 rounded - lg transition - all duration - 200 group ${isActive
                                    ? 'bg-[#FFBA34] text-black font-bold shadow-lg'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                } `
                            }
                        >
                            <item.icon size={20} className="shrink-0" />
                            <span className="text-sm uppercase tracking-wide">{item.name}</span>
                        </NavLink>
                    ))}

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">MODÉRATION</p>
                        <div className="space-y-1 px-2">
                            <NavLink
                                to="/admin/reports"
                                className={({ isActive }) => `flex items - center gap - 3 px - 4 py - 3 rounded - xl transition - all duration - 300 ${isActive ? 'bg-[#FFBA34] text-black font-black shadow-lg shadow-[#FFBA34]/20 scale-105' : 'text-gray-400 hover:bg-white/5 hover:text-white'} `}
                            >
                                <ShieldAlert size={18} />
                                <span className="text-sm">Signalements</span>
                            </NavLink>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">STRUCTURES</p>
                        <div className="space-y-1 px-2">
                            <NavLink
                                to="/admin/categories"
                                className={({ isActive }) => `flex items - center gap - 3 px - 4 py - 3 rounded - xl transition - all duration - 300 ${isActive ? 'bg-[#FFBA34] text-black font-black shadow-lg shadow-[#FFBA34]/20 scale-105' : 'text-gray-400 hover:bg-white/5 hover:text-white'} `}
                            >
                                <Grid size={18} />
                                <span className="text-sm">Catégories</span>
                            </NavLink>
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <NavLink
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/50 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-xs uppercase font-bold">Retour au site</span>
                    </NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10 backdrop-blur-md bg-white/80">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Panneau de Contrôle</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase">Mode Administrateur</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
