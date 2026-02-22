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
            <div className={`relative z-20 h-full w-full flex flex-col justify-center p-8 md:p-20 ${reverse ? 'items-end text-right' : 'items-start text-left'}`}>
                {/* Text Content */}
                <div className={`flex flex-col max-w-lg ${reverse ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase mb-2 text-[#FFBA34]">
                        {subtitle}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-white leading-[1.15]">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-[11px] md:text-sm font-medium leading-relaxed mb-6 max-w-[36ch] text-white/80">
                            {description}
                        </p>
                    )}
                    <div className="mt-1">
                        <Link
                            to={ctaLink}
                            className="inline-flex items-center gap-2 py-3 px-8 rounded-full font-bold text-xs md:text-sm transition-all active:scale-95 bg-[#FFBA34] text-[#1A3620] hover:bg-white hover:text-[#1A3620] shadow-lg shadow-black/20"
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
