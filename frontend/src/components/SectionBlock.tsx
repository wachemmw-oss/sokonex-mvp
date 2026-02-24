import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from './AdCard';
import { ChevronRight } from 'lucide-react';

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
    const bgClass = getVariantStyles(variant);

    return (
        <section className={`py-12 md:py-20 ${bgClass} transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase italic text-[#1A3620] leading-none flex items-center gap-4">
                            <span className="w-2 h-10 md:h-14 bg-[#FFBA34] rounded-full inline-block shadow-[0_0_15px_rgba(255,186,52,0.3)]"></span>
                            {title}
                        </h2>
                        <div className="h-1 w-24 bg-[#FFBA34]/20 rounded-full ml-6"></div>
                    </div>

                    <Link
                        to={seeMorePath}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1A3620] rounded-full text-xs font-black uppercase tracking-[0.2em] border border-[#1A3620]/10 hover:bg-[#1A3620] hover:text-white hover:border-[#1A3620] transition-all duration-500 shadow-sm hover:shadow-xl"
                    >
                        Explorer la sélection
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                    </Link>
                </div>

                {loading ? (
                    <SectionSkeleton />
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {items.map((ad) => (
                            <AdCard key={ad._id} ad={ad} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white/40 backdrop-blur-sm rounded-[40px] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-black text-sm uppercase tracking-widest italic">Aucune annonce pour le moment</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SectionBlock;
