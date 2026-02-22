import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, suspendUser } from '../services/admin';
import { Shield, Search, UserCheck, UserX, Mail, Calendar, Hash } from 'lucide-react';

const AdminUsers: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = React.useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: getUsers,
    });

    const suspendMutation = useMutation({
        mutationFn: suspendUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });

    if (isLoading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-white rounded-3xl w-1/3 border border-gray-100 shadow-sm"></div>
            <div className="h-[500px] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm"></div>
        </div>
    );

    const users = data?.data || [];
    const filteredUsers = users.filter((u: any) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Utilisateurs</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez et modérez la communauté SOKONEX.</p>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-[#FFBA34] transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un membre..."
                        className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-[#FFBA34]/10 focus:border-[#FFBA34] outline-none w-full md:w-80 text-sm font-semibold transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-gray-100 overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y-2 divide-slate-50">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Membre</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Accès</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Arrivée</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y-2 divide-slate-50">
                            {filteredUsers.map((user: any) => (
                                <tr key={user._id} className="hover:bg-slate-50/40 transition-colors group/row">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A3620] to-[#2d5a35] flex items-center justify-center text-[#FFBA34] font-black text-lg shadow-md overflow-hidden relative group-hover/row:scale-105 transition-transform">
                                                {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800 tracking-tight">{user.name}</span>
                                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                    <Mail size={12} /> {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                            {user.role === 'admin' ? <Shield size={12} strokeWidth={3} /> : <Hash size={12} strokeWidth={3} />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 underline decoration-rose-200 underline-offset-2'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                            {user.status === 'active' ? 'Actif' : 'Suspendu'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                            <Calendar size={14} className="text-slate-300" />
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`${user.status === 'active' ? 'Suspendre' : 'Réactiver'} cet utilisateur ?`)) {
                                                    suspendMutation.mutate(user._id);
                                                }
                                            }}
                                            className={`p-3 rounded-2xl transition-all duration-300 transform active:scale-90 shadow-sm ${user.status === 'active'
                                                ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/20'
                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20'}`}
                                            title={user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                                        >
                                            {user.status === 'active' ? <UserX size={18} strokeWidth={2.5} /> : <UserCheck size={18} strokeWidth={2.5} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center bg-slate-50/20">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-4 rotate-12">
                            <Search size={40} />
                        </div>
                        <p className="text-slate-400 text-sm font-black uppercase tracking-widest">Aucun résultat trouvé</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
