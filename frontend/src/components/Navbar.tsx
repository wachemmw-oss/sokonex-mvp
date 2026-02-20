import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo & Desktop Nav */}
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-extrabold text-blue-600 tracking-tighter">SOKONEX</span>
                        </Link>
                        <div className="hidden md:ml-8 md:flex md:space-x-8">
                            <Link to="/results" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Explorer
                            </Link>
                            <Link to="/results?category=immobilier" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Immobilier
                            </Link>
                            <Link to="/results?category=vehicules" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Véhicules
                            </Link>
                        </div>
                    </div>

                    {/* Right Side Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/post" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-bold text-sm transition shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Publier une annonce
                        </Link>

                        {user ? (
                            <div className="ml-3 relative">
                                <div>
                                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 items-center gap-2 border border-gray-200 p-1 pr-3 hover:bg-gray-50 transition">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-gray-700 font-medium">{user.name?.split(' ')[0]}</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                </div>
                                {/* Dropdown */}
                                {isUserMenuOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" onMouseLeave={() => setIsUserMenuOpen(false)}>
                                        <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>Mon Tableau de bord</Link>
                                        <Link to="/account/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>Paramètres</Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="block px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50" onClick={() => setIsUserMenuOpen(false)}>Administration</Link>
                                        )}
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100">
                                            Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600 transition">Se connecter</Link>
                                {/* <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 transition">S'inscrire</Link> */}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex items-center md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link to="/" className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                        <Link to="/results" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" onClick={() => setIsMenuOpen(false)}>Explorer</Link>
                        <Link to="/post" className="border-transparent text-orange-600 font-bold hover:bg-gray-50 hover:border-orange-300 block pl-3 pr-4 py-2 border-l-4 text-base" onClick={() => setIsMenuOpen(false)}>Publier une annonce</Link>
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {user ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                </div>
                                <div className="ml-auto">
                                    <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 underline">Déconnexion</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-around px-4">
                                <Link to="/login" className="text-base font-medium text-gray-500 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Se connecter</Link>
                                <Link to="/register" className="text-base font-medium text-blue-600 hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>S'inscrire</Link>
                            </div>
                        )}
                        {user && user.role === 'admin' && (
                            <div className="mt-3 px-2 space-y-1">
                                <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50" onClick={() => setIsMenuOpen(false)}>Administration</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
