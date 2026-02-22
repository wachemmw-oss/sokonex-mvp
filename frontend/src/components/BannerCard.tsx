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
        <div className={`relative overflow-hidden rounded-3xl shadow-lg group min-h-[400px] md:min-h-[460px] ${bgColor}`}>
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-[3000ms]"
                />
                {/* Advanced Gradient Scrim (Overlay) */}
                <div className={`absolute inset-0 z-10 ${reverse
                    ? 'bg-gradient-to-l from-black/80 via-black/40 to-transparent'
                    : 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
                    }`} />
            </div>

            {/* Content Layer */}
            <div className={`relative z-20 h-full w-full flex flex-col justify-center p-8 md:p-24 ${reverse ? 'items-end text-right' : 'items-start text-left'}`}>
                {/* Text Container with subtle glass effect for guaranteed visibility */}
                <div className={`flex flex-col max-w-2xl bg-black/10 backdrop-blur-[4px] p-8 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl ${reverse ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-4 text-[#FFBA34] drop-shadow-sm">
                        {subtitle}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6 text-white drop-shadow-2xl">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-xs md:text-base font-bold leading-relaxed mb-10 max-w-[42ch] text-white/80 drop-shadow-md">
                            {description}
                        </p>
                    )}
                    <div className="mt-2">
                        <Link
                            to={ctaLink}
                            className="inline-flex items-center gap-4 py-4 px-12 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,186,52,0.3)] bg-[#FFBA34] text-[#1A3620] hover:bg-white hover:scale-110 hover:shadow-white/20"
                        >
                            {ctaText}
                            <ChevronRight size={20} strokeWidth={3} />
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
