import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BannerCardProps {
    title: string;
    subtitle: string;
    subtitleIcon?: LucideIcon;
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
    subtitleIcon: SubtitleIcon,
    description,
    ctaText,
    ctaLink,
    image,
    bgColor = 'bg-slate-900',
    dark = true,
    reverse = false,
}) => {
    return (
        <div className={`relative overflow-hidden rounded-3xl group min-h-[420px] md:min-h-[520px] ${bgColor}`}>
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt={title}
                    loading="eager"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-[4000ms]"
                />
                {/* Cinema Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-black/45 to-black/75" />
                <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.35)_100%)]" />
            </div>

            {/* Content Layer - Centered */}
            <div className="relative z-20 h-full w-full flex flex-col items-center justify-center text-center p-8 md:p-20">
                <div className="flex flex-col items-center max-w-2xl">

                    {/* Subtitle with icon */}
                    <div
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
                    >
                        {SubtitleIcon && <SubtitleIcon className="w-4 h-4 text-[#D32F2F]" strokeWidth={2.5} />}
                        <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white">
                            {subtitle}
                        </span>
                    </div>

                    <h2
                        className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.05]"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        {title.split(' ').map((word, i) => (
                            <span key={i} className={i % 3 === 2 ? 'text-[#D32F2F]' : ''}>
                                {word}{' '}
                            </span>
                        ))}
                    </h2>

                    {description && (
                        <p className="text-sm md:text-lg font-medium leading-relaxed mb-10 max-w-[45ch] text-white/85 drop-shadow-md">
                            {description}
                        </p>
                    )}

                    <div className="mt-2">
                        <Link
                            to={ctaLink}
                            className="group/btn relative inline-flex items-center gap-3 py-4 px-10 rounded-full font-extrabold text-sm md:text-base transition-all active:scale-95 bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-[0_10px_30px_rgba(211,47,47,0.4)] hover:shadow-[0_15px_40px_rgba(211,47,47,0.6)] hover:scale-105"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                            {ctaText}
                            <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Subtle red light leak */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-[#D32F2F]/5 to-transparent pointer-events-none z-15"></div>
        </div>
    );
};

export default BannerCard;
