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
    bgColor = 'bg-white',
    dark = false,
    reverse = false,
}) => {
    return (
        <div className={`relative overflow-hidden rounded-premium shadow-premium group flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} ${bgColor} ${dark ? 'text-white' : 'text-[#1A3620]'} h-full min-h-[320px] md:min-h-[380px]`}>
            {/* Content Area */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] mb-4 ${dark ? 'text-white/60' : 'text-slate-400'}`}>
                    {subtitle}
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-[0.9] mb-6 max-w-[12ch]">
                    {title}
                </h2>
                {description && (
                    <p className={`text-sm font-medium leading-relaxed mb-8 max-w-[30ch] ${dark ? 'text-white/70' : 'text-slate-500'}`}>
                        {description}
                    </p>
                )}
                <div className="mt-auto">
                    <Link
                        to={ctaLink}
                        className={`inline-flex items-center gap-2 py-4 px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-premium active:scale-95 shadow-lg ${dark
                                ? 'bg-white text-[#1A3620] hover:bg-[#FFBA34] hover:shadow-[#FFBA34]/20'
                                : 'bg-[#1A3620] text-white hover:scale-[1.02] shadow-[#1A3620]/20'
                            }`}
                    >
                        {ctaText}
                        <ChevronRight size={16} strokeWidth={3} />
                    </Link>
                </div>
            </div>

            {/* Image Area */}
            <div className="flex-1 relative min-h-[200px] md:min-h-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-[2000ms] cubic-bezier(0.4, 0, 0.2, 1)"
                />
                {/* Overlay for better text readability on mobile if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden"></div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
    );
};

export default BannerCard;
