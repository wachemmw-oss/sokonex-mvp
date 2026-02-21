import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-gray-100 rounded-sm shadow-sm font-sans">
            <h2 className="text-2xl font-extrabold mb-8 text-center uppercase tracking-tight">Connexion</h2>
            {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-sm focus:outline-none focus:border-[#214829] focus:ring-1 focus:ring-[#214829] transition-colors" required />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Mot de passe</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-sm focus:outline-none focus:border-[#214829] focus:ring-1 focus:ring-[#214829] transition-colors" required />
                </div>
                <button type="submit" className="w-full text-white font-bold py-3 rounded-sm transition active:scale-95" style={{ backgroundColor: '#214829' }}>Se connecter</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Pas de compte ? <Link to="/register" className="font-bold underline" style={{ color: '#214829' }}>S'inscrire</Link>
            </p>
        </div>
    );
};

export default Login;
