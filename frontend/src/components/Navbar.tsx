import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, LogOut, LayoutDashboard, Settings, ShieldAlert, Search, Bell } from 'lucide-react';

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

    const location = useLocation();
    const isHome = location.pathname === '/';
    const isAdDetails = location.pathname.startsWith('/ad/');

    return (
        <nav className="bg-white sticky top-0 z-50 font-sans transition-all duration-300">
            {/* Desktop Navbar */}
            <div className="hidden md:block border-b border-gray-100 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full gap-4">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center h-full group">
                            <img
                                src="/src/assets/sokonex-logo-png.png"
                                alt="SOKONEX Logo"
                                className="h-8 md:h-10 w-auto object-contain transform group-hover:scale-105 transition-transform"
                            />
                        </Link>

                        {/* Integrated Search Bar (Desktop) */}
                        {!isAdDetails && (
                            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                                <form onSubmit={handleSearch} className="w-full relative group flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Rechercher des articles..."
                                        className="w-full bg-gray-100 border-none rounded-sm py-2 px-4 text-sm focus:ring-0 focus:outline-none focus:bg-gray-200 transition-colors placeholder-gray-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-gray-600 hover:text-black transition">
                                        <Search className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        )}
                        {/* Placeholder if AdDetails so logo stays left and actions right */}
                        {isAdDetails && <div className="hidden md:block flex-1"></div>}

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Post Ad Button - Hidden on Mobile (moved to BottomTab) */}
                            <Link
                                to={user ? "/post" : "/login"}
                                onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault();
                                        navigate('/login', { state: { message: "Vous devez être connecté pour publier une annonce." } });
                                    }
                                }}
                                className="hidden md:inline-flex font-semibold text-sm transition items-center gap-2 px-6 py-2 rounded-sm" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                Publier
                            </Link>

                            {/* User Profile / Login */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-800 hover:text-black transition focus:outline-none"
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

                                            <Link to="/account" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-[#EBF5EE] hover:text-[#214829] transition" onClick={() => setIsUserMenuOpen(false)}>
                                                <LayoutDashboard className="w-4 h-4 mr-3" /> Tableau de bord
                                            </Link>
                                            <Link to="/account/settings" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-[#EBF5EE] hover:text-[#214829] transition" onClick={() => setIsUserMenuOpen(false)}>
                                                <Settings className="w-4 h-4 mr-3" /> Paramètres
                                            </Link>

                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 transition" onClick={() => setIsUserMenuOpen(false)}>
                                                    <ShieldAlert className="w-4 h-4 mr-3" /> Administration
                                                </Link>
                                            )}

                                            <div className="border-t border-gray-50 mt-1">
                                                <button onClick={handleLogout} className="flex w-full items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-500 transition text-left">
                                                    <LogOut className="w-4 h-4 mr-3" /> Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link to="/login" className="text-gray-800 font-medium hover:text-black text-sm px-3 py-2 transition-colors">Connexion</Link>
                                    <Link to="/register" className="font-medium text-sm px-4 py-2 rounded-sm transition hidden sm:inline-block" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                                        Inscription
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navbar (Matching Exact Screenshot) */}
            {!isAdDetails && (
                <div className="md:hidden px-3 py-2.5 flex items-center gap-3 border-b border-gray-100 bg-white">
                    <button className="font-bold text-[13px] px-4 py-2 rounded-sm flex items-center justify-center shrink-0 h-[42px]" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                        Ville
                    </button>
                    <form onSubmit={handleSearch} className="flex-1 relative flex items-center h-[42px]">
                        <input
                            type="text"
                            placeholder="Rechercher des articles..."
                            className="w-full h-full bg-gray-100 border-none rounded-sm py-0 pl-3 pr-12 text-[13px] focus:ring-0 focus:outline-none placeholder-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-1 top-1 bottom-1 w-[46px] flex items-center justify-center rounded-sm transition-colors" style={{ backgroundColor: '#214829', color: 'white' }}>
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                    <button className="text-gray-800 p-1 shrink-0 flex items-center justify-center h-[42px]">
                        <Bell className="w-[26px] h-[26px]" strokeWidth={1.5} />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
