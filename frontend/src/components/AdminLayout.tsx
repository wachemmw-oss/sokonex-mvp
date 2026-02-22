import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Flag, Settings, ArrowLeft, ShieldAlert, Grid, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Tableau de Bord', path: '/admin', icon: LayoutDashboard },
        { name: 'Utilisateurs', path: '/admin/users', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-[#FFBA34] selection:text-black">
            {/* Sidebar with Glassmorphism */}
            <aside className="w-full md:w-72 bg-[#1A3620] text-white flex flex-col shrink-0 shadow-2xl relative z-20 overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#FFBA34]/10 rounded-full blur-3xl"></div>

                <div className="p-8 pb-6 relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#FFBA34] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFBA34]/20 transform -rotate-6">
                            <ShieldAlert className="text-black" size={24} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter italic">SOKONEX <span className="text-[#FFBA34] not-italic">AD</span></span>
                    </div>
                    <div className="h-1 w-12 bg-[#FFBA34] rounded-full"></div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1 relative z-10 overflow-y-auto scrollbar-hide">
                    <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Principal</p>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'bg-white/10 text-[#FFBA34] shadow-inner backdrop-blur-md'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${window.location.pathname === item.path ? 'scale-110' : ''}`} />
                                <span className="text-sm font-bold tracking-wide">{item.name}</span>
                            </div>
                            {window.location.pathname === item.path && <ChevronRight size={14} className="opacity-50" />}
                        </NavLink>
                    ))}

                    <div className="mt-10 mb-4 px-4 h-px bg-white/5 w-full"></div>

                    <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Gestion & Modération</p>
                    <div className="space-y-1">
                        <NavLink
                            to="/admin/reports"
                            className={({ isActive }) => `flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/10 text-[#FFBA34] shadow-inner backdrop-blur-md' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Flag size={20} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-sm font-bold tracking-wide">Signalements</span>
                            </div>
                        </NavLink>

                        <NavLink
                            to="/admin/categories"
                            className={({ isActive }) => `flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/10 text-[#FFBA34] shadow-inner backdrop-blur-md' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Grid size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold tracking-wide">Catégories</span>
                            </div>
                        </NavLink>
                    </div>

                    <div className="mt-10 mb-4 px-4 h-px bg-white/5 w-full"></div>
                    <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Système</p>
                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) => `flex items-center gap-3 group px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/10 text-[#FFBA34]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="text-sm font-bold tracking-wide">Paramètres</span>
                    </NavLink>
                </nav>

                {/* Profile Card Section */}
                <div className="p-4 relative z-10 border-t border-white/5 bg-black/10 backdrop-blur-sm">
                    {user && (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFBA34] to-[#f97316] flex items-center justify-center text-black font-black text-sm shadow-lg overflow-hidden shrink-0">
                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-white uppercase tracking-tight">{user.name}</p>
                                <p className="text-[10px] text-[#FFBA34] font-black uppercase tracking-widest leading-none mt-1">Administrateur</p>
                            </div>
                            <button onClick={handleLogout} className="text-white/30 hover:text-red-400 transition-colors" title="Déconnexion">
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}
                    <NavLink
                        to="/"
                        className="flex items-center justify-center gap-2 py-3 w-full rounded-2xl bg-[#FFBA34] text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#FFBA34]/10"
                    >
                        <ArrowLeft size={14} strokeWidth={3} />
                        Retour au site
                    </NavLink>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">SOKONEX HQ</span>
                        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                            {menuItems.find(m => window.location.pathname === m.path)?.name || "Gestion"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Serveur Actif
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto pb-20">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
