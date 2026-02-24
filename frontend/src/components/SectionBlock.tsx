import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from './AdCard';
import { ChevronRight } from 'lucide-react';

interface SectionBlockProps {
    title: string;
    seeMorePath: string;
    items: any[];
    loading: boolean;
}

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

const SectionBlock: React.FC<SectionBlockProps> = ({ title, seeMorePath, items, loading }) => {
    return (
        <section className="py-10 border-t border-gray-50 first:border-t-0">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic text-[#1A3620] leading-none flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-[#FFBA34] rounded-full inline-block"></span>
                    {title}
                </h2>
                <Link
                    to={seeMorePath}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#F8FBF8] text-[#1A3620] rounded-full text-xs font-black uppercase tracking-widest border border-[#1A3620]/5 hover:bg-[#FFBA34] hover:border-[#FFBA34] transition-all duration-300"
                >
                    Voir plus
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" strokeWidth={3} />
                </Link>
            </div>

            {loading ? (
                <SectionSkeleton />
            ) : items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {items.map((ad) => (
                        <AdCard key={ad._id} ad={ad} />
                    ))}
                </div>
            ) : (
                <div className="py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Aucune annonce pour le moment</p>
                </div>
            )}
        </section>
    );
};

export default SectionBlock;
