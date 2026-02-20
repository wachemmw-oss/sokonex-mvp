import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, LogOut, LayoutDashboard, Settings, ShieldAlert, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100 font-sans h-16 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-1 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 transform group-hover:rotate-6 transition-transform">
                            S
                        </div>
                        <span className="text-2xl font-extrabold text-slate-800 tracking-tighter group-hover:text-blue-700 transition-colors">
                            OKONEX
                        </span>
                    </Link>

                    {/* Integrated Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-4">
                        <form onSubmit={handleSearch} className="w-full relative group">
                            <input
                                type="text"
                                placeholder="Rechercher sur Sokonex..."
                                className="w-full bg-slate-50 border border-transparent group-hover:border-blue-200 rounded-full py-2.5 pl-5 pr-12 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-1 top-1 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition shadow-sm">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Mobile Search Icon (visible only on small screens) */}
                        <Link to="/results" className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition">
                            <Search className="w-6 h-6" />
                        </Link>

                        {/* Post Ad Button - Hidden on Mobile (moved to BottomTab) */}
                        <Link to="/post" className="hidden md:inline-flex bg-gradient-orange hover:brightness-110 text-white px-5 py-2.5 rounded-full font-bold text-sm transition shadow-lg shadow-orange-500/20 items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Publier
                        </Link>

                        {/* User Profile / Login */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition focus:outline-none ring-2 ring-transparent focus:ring-blue-100"
                                >
                                    <UserIcon className="w-5 h-5" />
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-60 rounded-xl shadow-xl shadow-slate-200/50 py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-50"
                                        onMouseLeave={() => setIsUserMenuOpen(false)}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>

                                        <Link to="/account" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setIsUserMenuOpen(false)}>
                                            <LayoutDashboard className="w-4 h-4 mr-3" /> Tableau de bord
                                        </Link>
                                        <Link to="/account/settings" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setIsUserMenuOpen(false)}>
                                            <Settings className="w-4 h-4 mr-3" /> Paramètres
                                        </Link>

                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 transition" onClick={() => setIsUserMenuOpen(false)}>
                                                <ShieldAlert className="w-4 h-4 mr-3" /> Administration
                                            </Link>
                                        )}

                                        <div className="border-t border-gray-50 mt-1">
                                            <button onClick={handleLogout} className="flex w-full items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition text-left">
                                                <LogOut className="w-4 h-4 mr-3" /> Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-1">
                                <Link to="/login" className="text-slate-600 font-semibold hover:text-blue-600 text-sm px-4 py-2 transition-colors">Connexion</Link>
                                <Link to="/register" className="bg-blue-50 text-blue-700 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-blue-100 transition hidden sm:inline-block">
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
