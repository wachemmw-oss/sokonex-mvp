import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, User } from 'lucide-react';

const BottomTab = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'text-blue-600' : 'text-gray-500';
    };

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden font-sans">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                <Link to="/" className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${isActive('/')}`}>
                    <Home className="w-6 h-6 mb-1 group-hover:text-blue-600" />
                    <span className="text-xs group-hover:text-blue-600">Accueil</span>
                </Link>
                <Link to="/results" className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${isActive('/results')}`}>
                    <Search className="w-6 h-6 mb-1 group-hover:text-blue-600" />
                    <span className="text-xs group-hover:text-blue-600">Explorer</span>
                </Link>
                <Link to="/post" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group text-orange-600">
                    <PlusCircle className="w-8 h-8 mb-1 group-hover:text-orange-700 fill-orange-100" />
                    <span className="text-xs font-bold group-hover:text-orange-700">Publier</span>
                </Link>
                <Link to="/account" className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${isActive('/account')}`}>
                    <User className="w-6 h-6 mb-1 group-hover:text-blue-600" />
                    <span className="text-xs group-hover:text-blue-600">Profil</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomTab;
