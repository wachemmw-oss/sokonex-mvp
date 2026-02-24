import React from 'react';
import AdCard from './AdCard';
import SectionHeader from './SectionHeader';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionBlockProps {
    title: string;
    Icon: LucideIcon;
    seeMorePath: string;
    items: any[];
    loading: boolean;
    iconBgColor?: string;
    iconColor?: string;
    itemVariant?: 'default' | 'flash';
    layout?: 'carousel' | 'grid';
    children?: React.ReactNode;
}

const SectionSkeleton = () => (
    <div className="flex gap-4 overflow-hidden animate-pulse">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[170px] md:min-w-[240px] space-y-4">
                <div className="aspect-[3/4] bg-gray-100 rounded-2xl w-full"></div>
                <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
            </div>
        ))}
    </div>
);

const SectionBlock: React.FC<SectionBlockProps> = ({
    title,
    Icon,
    seeMorePath,
    items,
    loading,
    iconBgColor,
    iconColor,
    itemVariant = 'default',
    layout = 'carousel',
    children
}) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-0">
                <SectionHeader
                    title={title}
                    Icon={Icon}
                    seeMorePath={seeMorePath}
                    iconBgColor={iconBgColor}
                    iconColor={iconColor}
                />

                {children}

                {/* ─── Carousel/Grid Container ─── */}
                <div className="relative group/carousel">
                    {layout === 'carousel' && (
                        <>
                            {/* Navigation Arrows (Desktop) */}
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white shadow-xl border border-gray-100 rounded-full p-2 z-10 hidden md:group-hover/carousel:flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400 hover:text-black"
                            >
                                <ChevronLeft size={24} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white shadow-xl border border-gray-100 rounded-full p-2 z-10 hidden md:group-hover/carousel:flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400 hover:text-black"
                            >
                                <ChevronRight size={24} strokeWidth={2.5} />
                            </button>
                        </>
                    )}

                    {/* Content Area */}
                    <div
                        ref={scrollRef}
                        className={layout === 'grid'
                            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
                            : "flex overflow-x-auto gap-3 md:gap-4 scrollbar-hide snap-x snap-mandatory pb-4"
                        }
                    >
                        {loading ? (
                            <SectionSkeleton />
                        ) : items.length > 0 ? (
                            items.map((ad) => (
                                <div key={ad._id} className={layout === 'grid' ? "" : "min-w-[175px] md:min-w-[220px] lg:min-w-[245px] snap-start"}>
                                    <AdCard ad={ad} variant={itemVariant} />
                                </div>
                            ))
                        ) : (
                            <div className="w-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 col-span-full">
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Aucune annonce pour le moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SectionBlock;
