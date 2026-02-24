import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/sokonex-best-logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 font-sans">
            {/* Logo */}
            <Link to="/" className="mb-8">
                <img src={logo} alt="SOKONEX" className="h-12 w-auto" />
            </Link>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-8">
                <h2 className="text-2xl font-black mb-2 text-center tracking-tight text-gray-900">Connexion</h2>
                <p className="text-sm text-gray-500 text-center mb-8">Accédez à votre espace SOKONEX</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] transition-all bg-gray-50 focus:bg-white"
                            placeholder="votre@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] transition-all bg-gray-50 focus:bg-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-md shadow-red-200 mt-2"
                    >
                        Se connecter
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Pas de compte ?{' '}
                    <Link to="/register" className="font-bold text-[#D32F2F] hover:underline">
                        S'inscrire gratuitement
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
