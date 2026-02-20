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
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 font-sans h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-extrabold text-blue-700 tracking-tighter">SOKONEX</span>
                    </Link>

                    {/* Integrated Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-4">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <input
                                type="text"
                                placeholder="Rechercher sur Sokonex..."
                                className="w-full bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Mobile Search Icon (visible only on small screens) */}
                        <Link to="/results" className="md:hidden p-2 text-gray-600">
                            <Search className="w-6 h-6" />
                        </Link>

                        {/* Post Ad Button - Hidden on Mobile (moved to BottomTab) */}
                        <Link to="/post" className="hidden md:inline-flex bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-bold text-sm transition shadow-md hover:shadow-lg items-center gap-2 transform hover:-translate-y-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Publier
                        </Link>

                        {/* User Profile / Login */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-50 text-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <UserIcon className="w-6 h-6" />
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                        onMouseLeave={() => setIsUserMenuOpen(false)}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <Link to="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition" onClick={() => setIsUserMenuOpen(false)}>
                                            <LayoutDashboard className="w-4 h-4 mr-2" /> Tableau de bord
                                        </Link>
                                        <Link to="/account/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition" onClick={() => setIsUserMenuOpen(false)}>
                                            <Settings className="w-4 h-4 mr-2" /> Paramètres
                                        </Link>

                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 transition" onClick={() => setIsUserMenuOpen(false)}>
                                                <ShieldAlert className="w-4 h-4 mr-2" /> Administration
                                            </Link>
                                        )}

                                        <div className="border-t border-gray-100 mt-1">
                                            <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition text-left">
                                                <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-600 font-medium hover:text-blue-600 text-sm px-3 py-2">Connexion</Link>
                                <Link to="/register" className="bg-blue-50 text-blue-700 font-bold text-sm px-4 py-2 rounded-full hover:bg-blue-100 transition hidden sm:inline-block">
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
