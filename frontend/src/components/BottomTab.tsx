import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, User, Heart } from 'lucide-react';

const BottomTab = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'text-blue-600' : 'text-gray-400';
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden font-sans">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 h-16 flex items-center justify-around px-2">
                <Link to="/" className={`flex flex-col items-center justify-center w-12 h-full ${isActive('/')}`}>
                    <Home className="w-6 h-6 mb-0.5" />
                    <span className="text-[10px] font-medium">Accueil</span>
                </Link>

                <Link to="/results" className={`flex flex-col items-center justify-center w-12 h-full ${isActive('/results')}`}>
                    <Search className="w-6 h-6 mb-0.5" />
                    <span className="text-[10px] font-medium">Explorer</span>
                </Link>

                <Link to="/post" className="flex flex-col items-center justify-center -mt-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50 text-white">
                        <PlusCircle className="w-8 h-8" />
                    </div>
                </Link>

                {/* Placeholder for Saved/Favorites */}
                <button className="flex flex-col items-center justify-center w-12 h-full text-gray-400 hover:text-blue-600 transition">
                    <Heart className="w-6 h-6 mb-0.5" />
                    <span className="text-[10px] font-medium">Favoris</span>
                </button>

                <Link to="/account" className={`flex flex-col items-center justify-center w-12 h-full ${isActive('/account')}`}>
                    <User className="w-6 h-6 mb-0.5" />
                    <span className="text-[10px] font-medium">Profil</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomTab;
