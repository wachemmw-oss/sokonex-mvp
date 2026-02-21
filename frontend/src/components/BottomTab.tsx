import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, User, PlusSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomTab = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isActive = (path: string) => location.pathname === path;
    const isHome = isActive('/') || location.pathname === '';

    const tabClass = (active: boolean) =>
        `flex flex-col items-center justify-center w-16 h-full transition-colors ${active ? 'text-[#214829]' : 'text-gray-500 hover:text-gray-800'}`;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden font-sans bg-white border-t border-gray-200 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
            <div className="h-[60px] flex items-center justify-around px-2">
                <Link to="/" className={tabClass(isHome)}>
                    <Home className="w-[26px] h-[26px] mb-1" strokeWidth={isHome ? 2.5 : 1.5} />
                    <span className="text-[11px] font-bold tracking-wide">Accueil</span>
                </Link>

                <Link to="/results" className={tabClass(isActive('/results'))}>
                    <Search className="w-[26px] h-[26px] mb-1" strokeWidth={isActive('/results') ? 2.5 : 1.5} />
                    <span className="text-[11px] font-bold tracking-wide">Explorer</span>
                </Link>

                <Link
                    to={user ? "/post" : "/login"}
                    className={tabClass(isActive('/post'))}
                    onClick={(e) => {
                        if (!user) {
                            e.preventDefault();
                            navigate('/login', { state: { message: "Vous devez être connecté pour publier une annonce." } });
                        }
                    }}
                >
                    <PlusSquare className="w-[26px] h-[26px] mb-1" strokeWidth={isActive('/post') ? 2.5 : 1.5} />
                    <span className="text-[11px] font-bold tracking-wide">Publier</span>
                </Link>

                <Link
                    to={user ? "/account" : "/login"}
                    className={tabClass(isActive('/account'))}
                    onClick={(e) => {
                        if (!user) {
                            e.preventDefault();
                            navigate('/login', { state: { message: "Vous devez être connecté pour voir votre profil." } });
                        }
                    }}
                >
                    <User className="w-[26px] h-[26px] mb-1" strokeWidth={isActive('/account') ? 2.5 : 1.5} />
                    <span className="text-[11px] font-bold tracking-wide">Profil</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomTab;
