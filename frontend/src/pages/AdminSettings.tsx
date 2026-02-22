import React from 'react';
import { Settings as SettingsIcon, Bell, Palette, Lock, Globe } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const settingsGroups = [
        {
            title: 'Général',
            icon: SettingsIcon,
            items: [
                { label: 'Nom de la plateforme', value: 'SOKONEX Marketplace', action: 'Modifier' },
                { label: 'Langue par défaut', value: 'Français (FR)', action: 'Changer' },
                { label: 'Fuseau horaire', value: 'Central Africa Time (GMT+2)', action: 'Ajuster' },
            ]
        },
        {
            title: 'Apparence',
            icon: Palette,
            items: [
                { label: 'Thème', value: 'Sombre / SOKONEX Green', action: 'Modifier' },
                { label: 'Logo principal', value: 'icone-logo.png', action: 'Remplacer' },
            ]
        },
        {
            title: 'Notifications',
            icon: Bell,
            items: [
                { label: 'Alertes par email', value: 'Activé', action: 'Gérer' },
                { label: 'Signalements critiques', value: 'Push instantané', action: 'Config' },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Paramètres</h2>
                <p className="text-slate-500 font-medium mt-1">Configurez les options globales de votre plateforme.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {settingsGroups.map((group, idx) => (
                    <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-gray-100 group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#FFBA34] group-hover:rotate-12 transition-transform">
                                <group.icon size={24} />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{group.title}</h3>
                        </div>

                        <div className="space-y-4">
                            {group.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-700">{item.value}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-white text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 shadow-sm hover:bg-slate-800 hover:text-[#FFBA34] hover:border-slate-800 transition-all">
                                        {item.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#1A3620] p-10 rounded-[2.5rem] shadow-xl shadow-[#1A3620]/20 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#FFBA34]">
                            <Lock size={32} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black tracking-tight">Zone de Sécurité</h4>
                            <p className="text-white/60 text-sm font-medium">Gestion des clés API et des protocoles d'authentification.</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-[#FFBA34] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg">
                        Accéder aux clés
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
