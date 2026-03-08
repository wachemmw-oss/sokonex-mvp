import React from 'react';
import { ExternalLink, Globe, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const DomainUpdateLanding: React.FC = () => {
    const targetDomain = "sokonext.com";
    const targetUrl = `https://${targetDomain}`;

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center font-sans overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[var(--color-gold)]/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-gold)] to-[var(--color-primary)] opacity-80"></div>

            <div className="max-w-[480px] w-full z-10 space-y-8">
                {/* Logo / Icon Area */}
                <div className="flex flex-col items-center animate-scale-in">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[var(--color-primary)] rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-white/50 backdrop-blur-sm">
                            <Globe className="w-12 h-12 text-[var(--color-primary)] animate-pulse" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--color-gold)] rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#FAFAF8]">
                            <Zap className="w-5 h-5 text-white fill-white" />
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 border border-gray-100 flex flex-col items-center gap-8 animate-fade-in-up delay-100">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                             <span className="px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[11px] font-black uppercase tracking-widest rounded-full">
                                Mise à jour
                             </span>
                        </div>
                        <h1 className="text-[32px] font-black text-[#1a1a2e] leading-[1.1] tracking-tight">
                            On déménage vers <br/>
                            <span className="text-[var(--color-primary)] uppercase">Sokonext.com</span>
                        </h1>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-[90%] mx-auto">
                            Pour vous offrir une expérience plus fluide et sécurisée, SOKONEX est désormais accessible via son portail officiel.
                        </p>
                    </div>

                    {/* Domain Display */}
                    <div className="w-full p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center gap-2 group hover:border-[var(--color-primary)]/30 transition-colors animate-fade-in-up delay-200">
                        <span className="text-[14px] text-gray-400 font-bold uppercase tracking-widest">Nouveau lien direct</span>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-[#1a1a2e] tracking-tight">{targetDomain}</span>
                            <ExternalLink className="w-5 h-5 text-[var(--color-primary)]/50 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    {/* CTA Button */}
                    <a 
                        href={targetUrl}
                        className="w-full bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white font-black py-5 rounded-[2rem] shadow-xl transition-all transform hover:-translate-y-1.5 active:scale-95 flex items-center justify-center gap-4 no-underline group animate-fade-in-up delay-300"
                    >
                        Continuer sur SOKONEXT
                        <div className="bg-[var(--color-primary)] p-1.5 rounded-full group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </a>

                    {/* Safety Badge */}
                    <div className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-section-mode)] rounded-2xl animate-fade-in-up delay-400">
                        <ShieldCheck className="w-5 h-5 text-[#2196F3]" />
                        <span className="text-xs font-black text-gray-600 uppercase tracking-wide">Connexion sécurisée SSL</span>
                    </div>
                </div>

                {/* Footer and Meta */}
                <div className="space-y-6 animate-fade-in delay-500">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] opacity-60">
                        © 2026 SOKONEX • Technologie Marketplace RDC
                    </p>
                    <div className="h-1 w-12 bg-gray-200 mx-auto rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default DomainUpdateLanding;
