import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginService, register as registerService, getMe, updateProfile as updateProfileService } from '../services/auth';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    phone?: string;
    whatsapp?: string;
    avatar?: string;
    showPhone?: boolean;
    showWhatsApp?: boolean;
    isPhoneVerified?: boolean;
    settings?: {
        showPhone: boolean;
        showWhatsApp: boolean;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    updateProfile: (data: any) => Promise<any>;
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

    const updateProfile = async (data: any) => {
        const res = await updateProfileService(data);
        if (res.success) {
            // Update local user state with new data
            setUser(res.data);
            return res;
        } else {
            throw new Error(res.error?.message || 'Update failed');
        }
    };

    // Wait, I should better use multi_replace to fix imports AND the implementation in one go.
    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
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
