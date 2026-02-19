import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center mb-6">
            <Link to="/" className="text-xl font-bold text-blue-600">SOKONEX</Link>
            <div className="flex gap-4 items-center">
                <Link to="/results" className="hover:text-blue-600">Parcourir</Link>
                {user ? (
                    <>
                        <Link to="/post" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Publier</Link>
                        <Link to="/account" className="hover:text-blue-600">Mon Compte</Link>
                        <button onClick={logout} className="text-red-500 hover:text-red-700">Déconnexion</button>
                    </>
                ) : (
                    <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Se connecter</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
