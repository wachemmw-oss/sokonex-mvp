import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/category';
import {
    Search, User as UserIcon, LogOut, Menu, X, ChevronRight,
    Info, HelpCircle, ShieldCheck, FileText, Bell, SlidersHorizontal,
    LayoutDashboard, Settings, ShieldAlert, Heart, Grid, ShoppingCart
} from 'lucide-react';
import logo from '../assets/sokonex-best-logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);  // hamburger drawer
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const CATEGORIES_FROM_DB = categoriesData?.data || [];

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
            <div className="bg-[#D32F2F] h-10 w-full md:h-12" /> {/* Red Top Bar - show on mobile too now */}
            <nav className="sticky top-0 z-50 font-sans transition-all duration-300 -mt-5 md:-mt-6">
                {/* Desktop Navbar */}
                <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-full shadow-lg border border-gray-100 h-20 px-8 flex items-center justify-between gap-8 translate-y-[-10px]">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center h-full group">
                            <img
                                src={logo}
                                alt="SOKONEX Logo"
                                className="h-10 w-auto object-contain transform group-hover:scale-105 transition-transform"
                            />
                        </Link>

                        {/* Integrated Search Bar (Desktop) */}
                        <div className="flex-1 max-w-xl">
                            <form onSubmit={handleSearch} className="relative group flex items-center">
                                <div className="absolute left-4 text-gray-400">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher à Lubumbashi..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 pl-12 pr-16 text-sm focus:ring-2 focus:ring-[#D32F2F]/10 focus:outline-none focus:bg-white transition-all placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="absolute right-1.5 p-2.5 rounded-full bg-[#D32F2F] text-white hover:bg-black transition-colors shadow-sm">
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-6">
                            {/* Shopping Cart with Badge */}
                            <button className="relative text-gray-500 hover:text-[#D32F2F] transition-colors p-2">
                                <ShoppingCart className="w-6 h-6" strokeWidth={2} />
                                <span className="absolute top-1 right-1 bg-[#D32F2F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                            </button>

                            {/* Wishlist */}
                            <button className="text-gray-500 hover:text-[#D32F2F] transition-colors p-2">
                                <Heart className="w-6 h-6" strokeWidth={2} />
                            </button>

                            {/* User Menu Trigger */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-black transition-all border border-gray-100"
                                >
                                    <UserIcon className="w-5 h-5" />
                                </button>
                                {isUserMenuOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border border-gray-50 py-2 bg-white z-[100]"
                                        onMouseLeave={() => setIsUserMenuOpen(false)}
                                    >
                                        <div className="px-5 py-4 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-800">{user?.name || 'Visiteur'}</p>
                                            <p className="text-xs text-gray-500">{user?.email || 'Connectez-vous'}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/account" className="flex items-center px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition" onClick={() => setIsUserMenuOpen(false)}>
                                                <LayoutDashboard className="w-4 h-4 mr-3" /> Tableau de bord
                                            </Link>
                                            <Link to="/account/settings" className="flex items-center px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition" onClick={() => setIsUserMenuOpen(false)}>
                                                <Settings className="w-4 h-4 mr-3" /> Paramètres
                                            </Link>
                                        </div>
                                        <div className="border-t border-gray-50 mt-1 pt-1">
                                            {user ? (
                                                <button onClick={handleLogout} className="flex w-full items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium">
                                                    <LogOut className="w-4 h-4 mr-3" /> Déconnexion
                                                </button>
                                            ) : (
                                                <Link to="/login" className="flex items-center px-5 py-3 text-sm text-blue-600 hover:bg-blue-50 transition font-medium">
                                                    <UserIcon className="w-4 h-4 mr-3" /> Connexion
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Menu / Drawer Trigger */}
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
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
                                placeholder="Rechercher..."
                                className="w-full h-full bg-gray-50 border border-gray-100 rounded-full py-0 pl-4 pr-12 text-[13px] focus:ring-2 focus:ring-[#D32F2F]/10 focus:outline-none placeholder-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-1 top-1 bottom-1 w-[38px] flex items-center justify-center rounded-full transition-colors shadow-sm" style={{ backgroundColor: '#D32F2F', color: 'white' }}>
                                <Search className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Shopping Cart Icon (Mobile) */}
                        <button className="text-gray-500 p-1 shrink-0 flex items-center justify-center h-[42px] relative">
                            <ShoppingCart className="w-[24px] h-[24px]" strokeWidth={2} />
                            <span className="absolute top-1 right-0 bg-[#D32F2F] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">0</span>
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

                        <div className="p-4 border-b">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                <Grid className="w-3.5 h-3.5" /> Catégories
                            </p>
                            <div className="space-y-0.5">
                                {CATEGORIES_FROM_DB.map((cat: any) => (
                                    <Link
                                        key={cat.slug}
                                        to={`/results?category=${cat.slug}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between py-2.5 px-2 rounded-sm hover:bg-gray-50 text-sm text-gray-700 font-medium"
                                    >
                                        {cat.name}
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
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <ShieldAlert size={18} />
                                        <span>ADMINISTRATION</span>
                                    </Link>
                                )}
                                <div className="h-px bg-gray-100 my-1" />
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                                >
                                    <LogOut size={18} />
                                    <span>Se déconnecter</span>
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
