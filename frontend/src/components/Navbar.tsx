import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Search, User as UserIcon, LogOut, Menu, X, ChevronRight,
    Info, HelpCircle, ShieldCheck, FileText, Bell, SlidersHorizontal,
    LayoutDashboard, Settings, ShieldAlert, Heart, Grid
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import logo from '../assets/sokonex-best-logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);  // hamburger drawer
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
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
    const isResults = location.pathname === '/results';
    const isPostAd = location.pathname === '/post' || location.pathname.startsWith('/edit-ad/');
    const isDashboard = location.pathname.startsWith('/account') || location.pathname.startsWith('/admin');
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const hideSearch = isAdDetails || isDashboard || isAuthPage || isPostAd || isResults;

    return (
        <>
            <nav className="bg-white sticky top-0 z-50 font-sans transition-all duration-300">
                {/* Desktop Navbar */}
                <div className="hidden md:block border-b border-gray-100 h-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex justify-between items-center h-full gap-4">
                            {/* Logo */}
                            <Link to="/" className="flex-shrink-0 flex items-center h-full group">
                                <img
                                    src={logo}
                                    alt="SOKONEX Logo"
                                    className="h-9 md:h-11 w-auto object-contain transform group-hover:scale-105 transition-transform"
                                />
                            </Link>

                            {/* Integrated Search Bar (Desktop) */}
                            {!hideSearch && (
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
                            {isAdDetails && <div className="hidden md:block flex-1" />}

                            {/* Right Side Actions */}
                            <div className="flex items-center space-x-4">
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
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    Publier
                                </Link>

                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-800 hover:text-black transition focus:outline-none"
                                        >
                                            <UserIcon className="w-5 h-5" />
                                        </button>
                                        {isUserMenuOpen && (
                                            <div
                                                className="origin-top-right absolute right-0 mt-2 w-60 rounded-xl shadow-xl shadow-slate-200/50 py-2 bg-white ring-1 ring-black ring-opacity-5 z-50 border border-slate-50"
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

                {/* Mobile Navbar — hidden on Home but shown on Results/other if not specifically hidden */}
                {(!hideSearch || isResults) && (
                    <div className="md:hidden px-3 py-2.5 flex items-center gap-2 border-b border-gray-100 bg-white">
                        {/* Hamburger or Filter Menu Button */}
                        {isResults ? (
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-filters'))}
                                className="flex items-center justify-center shrink-0 h-[42px] w-[42px] rounded-sm bg-[#FFBA34]/10"
                            >
                                <SlidersHorizontal className="w-5 h-5 text-[#1A3620]" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="flex items-center justify-center shrink-0 h-[42px] w-[42px] rounded-sm bg-gray-100"
                            >
                                <Menu className="w-5 h-5 text-gray-700" />
                            </button>
                        )}

                        {/* Search Bar */}
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

                        {/* Notification Bell */}
                        <button className="text-gray-800 p-1 shrink-0 flex items-center justify-center h-[42px]">
                            <Bell className="w-[26px] h-[26px]" strokeWidth={1.5} />
                        </button>
                    </div>
                )}
            </nav>

            {/* Mobile Drawer Menu (full-height side panel from left) */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[200] flex">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />

                    {/* Drawer */}
                    <div className="relative w-[85vw] max-w-[320px] h-full bg-white flex flex-col overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: '#214829' }}>
                            <div className="flex items-center gap-2">
                                <img src={logo} alt="SOKONEX" className="h-7 w-auto brightness-0 invert" />
                                <span className="text-white font-bold tracking-wider text-lg">SOKONEX</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Profile Section */}
                        <div className="flex bg-gray-50 p-4 border-b items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFBA34]/20 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-[#214829]" />
                            </div>
                            <div>
                                {user ? (
                                    <>
                                        <p className="font-bold text-sm text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="font-bold text-sm text-gray-900">Se connecter</Link>
                                        <p className="text-xs text-gray-500">ou <Link to="/register" onClick={() => setIsMenuOpen(false)} className="underline text-[#214829]">S'inscrire</Link></p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="p-4 border-b">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                <Grid className="w-3.5 h-3.5" /> Catégories
                            </p>
                            <div className="space-y-0.5">
                                {CATEGORIES.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        to={`/results?category=${cat.id}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between py-2.5 px-2 rounded-sm hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                    >
                                        {cat.label}
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mon compte */}
                        {user && (
                            <div className="p-4 border-b">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Mon compte</p>
                                <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between py-2.5 px-2 rounded-sm hover:bg-gray-50 text-sm text-gray-700">
                                    <span className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4 text-gray-400" /> Mes annonces</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Link>
                                <Link to="/account/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between py-2.5 px-2 rounded-sm hover:bg-gray-50 text-sm text-gray-700">
                                    <span className="flex items-center gap-3"><Heart className="w-4 h-4 text-gray-400" /> Mes favoris</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Link>
                            </div>
                        )}

                        {/* Infos & Légal */}
                        <div className="p-4 border-b">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Informations</p>
                            <Link to="/aide" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between py-2.5 px-2 rounded-sm hover:bg-gray-50 text-sm text-gray-700">
                                <span className="flex items-center gap-3"><Info className="w-4 h-4 text-gray-400" /> Informations pratiques</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                            <Link to="/legal" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between py-2.5 px-2 rounded-sm hover:bg-gray-50 text-sm text-gray-700">
                                <span className="flex items-center gap-3"><FileText className="w-4 h-4 text-gray-400" /> Informations légales</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                        </div>

                        {/* Logout */}
                        {user && (
                            <div className="p-4 mt-auto">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 py-2.5 px-2 rounded-sm hover:bg-red-50 text-sm text-red-500 font-medium w-full"
                                >
                                    <LogOut className="w-4 h-4" /> Se déconnecter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
