import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from './AdCard';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';

interface SectionBlockProps {
    title: string;
    seeMorePath: string;
    items: any[];
    loading: boolean;
    variant?: 'flash' | 'exclusive' | 'trending' | 'mode' | 'beaute' | 'default';
}

const getVariantStyles = (variant?: string) => {
    switch (variant) {
        case 'flash': return 'bg-[var(--bg-section-flash)]';
        case 'exclusive': return 'bg-[var(--bg-section-exclusive)]';
        case 'trending': return 'bg-[var(--bg-section-trending)]';
        case 'mode': return 'bg-[var(--bg-section-mode)]';
        case 'beaute': return 'bg-[var(--bg-section-beaute)]';
        default: return 'bg-transparent';
    }
};

const SectionSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-gray-100 rounded-2xl w-full"></div>
                <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
            </div>
        ))}
    </div>
);

const SectionBlock: React.FC<SectionBlockProps> = ({ title, seeMorePath, items, loading, variant }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-8 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* ─── Dark Header Bar ─── */}
                <div className="bg-[#0F172A] rounded-lg p-3 md:p-4 flex items-center justify-between mb-6 shadow-md border border-white/5">
                    <h2 className="text-white text-sm md:text-xl font-bold flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-white/20 rounded-full"></span>
                        {title}
                    </h2>
                    <Link
                        to={seeMorePath}
                        className="text-white/80 hover:text-white flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        Voir Plus
                        <Search size={14} strokeWidth={3} />
                    </Link>
                </div>

                {/* ─── Carousel Container ─── */}
                <div className="relative group/carousel">
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

                    {/* Horizontal Scroll Element */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-3 md:gap-4 scrollbar-hide snap-x snap-mandatory pb-4"
                    >
                        {loading ? (
                            <SectionSkeleton />
                        ) : items.length > 0 ? (
                            items.map((ad) => (
                                <div key={ad._id} className="min-w-[170px] md:min-w-[220px] lg:min-w-[240px] snap-start">
                                    <AdCard ad={ad} />
                                </div>
                            ))
                        ) : (
                            <div className="w-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">Aucune annonce pour le moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SectionBlock;
