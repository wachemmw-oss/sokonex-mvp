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
                {/* Text Container with polished look */}
                <div className={`flex flex-col max-w-xl ${reverse ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs md:text-sm font-medium tracking-wide mb-2 text-white/90">
                        {subtitle}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white leading-[1.1]">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-xs md:text-base font-medium leading-relaxed mb-8 max-w-[40ch] text-white/70">
                            {description}
                        </p>
                    )}
                    <div className="mt-2">
                        <Link
                            to={ctaLink}
                            className="inline-flex items-center gap-3 py-3.5 px-8 rounded-full font-bold text-sm transition-all active:scale-95 bg-[#1A3620] text-white hover:bg-white hover:text-[#1A3620]"
                        >
                            {ctaText}
                            <ChevronRight size={18} strokeWidth={2.5} />
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
