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
        `flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${active ? 'text-[#D32F2F]' : 'text-gray-400 hover:text-gray-600'}`;

    return (
        <div
            className="md:hidden font-sans"
            style={{
                position: 'fixed',
                bottom: '16px',
                left: '16px',
                right: '16px',
                zIndex: 100,
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                willChange: 'transform',
            }}
        >
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 h-16 rounded-full shadow-2xl flex items-center justify-around px-4">
                <Link to="/" className={tabClass(isHome)}>
                    <Home className="w-[24px] h-[24px]" strokeWidth={isHome ? 2.5 : 2} />
                    <span className="text-[10px] font-bold mt-1">Accueil</span>
                </Link>

                <Link to="/results" className={tabClass(isActive('/results'))}>
                    <Search className="w-[24px] h-[24px]" strokeWidth={isActive('/results') ? 2.5 : 2} />
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
                    <PlusSquare className="w-[24px] h-[24px]" strokeWidth={isActive('/post') ? 2.5 : 2} />
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
                    <User className="w-[24px] h-[24px]" strokeWidth={isActive('/account') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold mt-1">Profil</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomTab;
