import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BannerCardProps {
    title: string;
    subtitle: string;
    description?: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    bgColor?: string;
    dark?: boolean;
    reverse?: boolean;
}

const BannerCard: React.FC<BannerCardProps> = ({
    title,
    subtitle,
    description,
    ctaText,
    ctaLink,
    image,
    bgColor = 'bg-slate-900',
    dark = true,
    reverse = false,
}) => {
    return (
        <div className={`relative overflow-hidden rounded-premium shadow-premium group min-h-[400px] md:min-h-[460px] ${bgColor}`}>
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-[3000ms] cubic-bezier(0.4, 0, 0.2, 1)"
                />
                {/* Advanced Gradient Scrim (Overlay) */}
                <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${reverse
                    ? 'bg-gradient-to-l from-black/80 via-black/40 to-transparent'
                    : 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
                    }`} />
                {/* Secondary grain/texture overlay for premium feel */}
                <div className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            {/* Content Layer */}
            <div className={`relative z-20 h-full w-full flex flex-col justify-center p-8 md:p-20 ${reverse ? 'items-end text-right' : 'items-start text-left'}`}>
                {/* Text Container with subtle glass effect for guaranteed visibility */}
                <div className={`flex flex-col max-w-2xl bg-black/10 backdrop-blur-[2px] p-6 md:p-10 rounded-[2.5rem] border border-white/5 ${reverse ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] mb-3 text-[#FFBA34] drop-shadow-sm">
                        {subtitle}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9] mb-5 text-white drop-shadow-xl">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-xs md:text-sm font-bold leading-relaxed mb-8 max-w-[38ch] text-white/80 drop-shadow-md">
                            {description}
                        </p>
                    )}
                    <div className="mt-2">
                        <Link
                            to={ctaLink}
                            className="inline-flex items-center gap-3 py-3.5 px-10 rounded-xl font-black text-xs uppercase tracking-widest transition-premium active:scale-95 shadow-[0_15px_40px_rgba(255,186,52,0.25)] bg-[#FFBA34] text-[#1A3620] hover:bg-white hover:scale-110 hover:shadow-white/20"
                        >
                            {ctaText}
                            <ChevronRight size={16} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Subtle interactive light effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-10 pointer-events-none"></div>
        </div>
    );
};

export default BannerCard;
