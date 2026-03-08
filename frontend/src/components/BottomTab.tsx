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
        `flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${active ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`;

    return (
        <div
            className="md:hidden font-sans fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]"
            style={{
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
            }}
        >
            <div className="h-16 flex items-center justify-around px-2">
                <Link to="/" className={tabClass(isHome)}>
                    <Home className="w-[22px] h-[22px]" strokeWidth={isHome ? 2.5 : 2} />
                    <span className="text-[10px] font-bold mt-1">Accueil</span>
                </Link>

                <Link to="/results" className={tabClass(isActive('/results'))}>
                    <Search className="w-[22px] h-[22px]" strokeWidth={isActive('/results') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold mt-1">Explorer</span>
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
                    <PlusSquare className="w-[22px] h-[22px]" strokeWidth={isActive('/post') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold mt-1">Vendre</span>
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
                    <User className="w-[22px] h-[22px]" strokeWidth={isActive('/account') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold mt-1">Profil</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomTab;
