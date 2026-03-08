import React from 'react';
import { ExternalLink, Globe, ArrowRight } from 'lucide-react';

const DomainUpdateLanding: React.FC = () => {
  const targetDomain = "sokonext.com";
  const targetUrl = `https://${targetDomain}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-gold)] to-[var(--color-primary)]"></div>
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Subtle background orb */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        
        <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mb-2">
          <Globe className="w-10 h-10 text-[var(--color-primary)]" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            NOUVELLE ADRESSE
          </h1>
          <p className="text-slate-500 font-medium px-2">
            SOKONEX a grandi ! Retrouvez votre marketplace préférée sur son domaine officiel.
          </p>
        </div>

        <div className="w-full p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center gap-2 group">
          <span className="text-lg font-bold text-slate-700">{targetDomain}</span>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </div>

        <a 
          href={targetUrl}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[var(--color-primary)]/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 no-underline"
        >
          Accéder à SOKONEXT
          <ArrowRight className="w-5 h-5" />
        </a>

        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Redirection recommandée vers SOKONEXT.COM
        </p>
      </div>

      <footer className="mt-12 text-slate-400 text-sm font-medium">
        © 2026 SOKONEX • L'avenir du commerce en RDC
      </footer>
    </div>
  );
};

export default DomainUpdateLanding;
