import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginService, register as registerService, getMe } from '../services/auth';

interface User {
    _id: string;
    email: string;
    role: 'user' | 'admin';
    phone?: string;
    isPhoneVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await getMe();
                    if (res.success) {
                        setUser(res.data);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (data: any) => {
        const res = await loginService(data);
        if (res.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
        } else {
            throw new Error(res.error?.message || 'Login failed');
        }
    };

    const register = async (data: any) => {
        const res = await registerService(data);
        if (res.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
        } else {
            throw new Error(res.error?.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
