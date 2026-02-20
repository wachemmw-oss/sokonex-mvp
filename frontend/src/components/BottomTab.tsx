import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, PlusSquare } from 'lucide-react';

const BottomTab = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'text-blue-600' : 'text-gray-400';
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden font-sans bg-white border-t border-gray-200 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="h-[60px] flex items-center justify-around px-2">
                <Link to="/" className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive('/') || location.pathname === '' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Home className="w-6 h-6 mb-1" strokeWidth={isActive('/') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium tracking-wide">Accueil</span>
                </Link>

                <Link to="/results" className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive('/results') ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Search className="w-6 h-6 mb-1" strokeWidth={isActive('/results') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium tracking-wide">Explorer</span>
                </Link>

                <Link to="/post" className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive('/post') ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                    <PlusSquare className="w-6 h-6 mb-1" strokeWidth={isActive('/post') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium tracking-wide">Publier</span>
                </Link>

                <Link to="/account" className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive('/account') ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                    <User className="w-6 h-6 mb-1" strokeWidth={isActive('/account') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium tracking-wide">Profil</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomTab;
