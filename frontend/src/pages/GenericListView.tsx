import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getListSection } from '../services/ads';
import AdCard from '../components/AdCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GenericListViewProps {
    title: string;
    section: string;
}

const GenericListView: React.FC<GenericListViewProps> = ({ title, section }) => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['list', section, page],
        queryFn: () => getListSection(section, page),
        placeholderData: (previousData) => previousData,
    });

    const ads = data?.data?.items || [];
    const totalPages = data?.data?.pages || 1;

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-12 min-h-screen">
            <header className="mb-12">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-[#1A3620] leading-tight">
                    <span className="text-[#FFBA34] drop-shadow-sm">/</span> {title}
                </h1>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2 ml-1">
                    {data?.data?.total || 0} Annonces disponibles
                </p>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-[4/5] bg-gray-100 rounded-3xl w-full"></div>
                            <div className="h-4 bg-gray-100 rounded-full w-3/4 mx-auto"></div>
                        </div>
                    ))}
                </div>
            ) : ads.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {ads.map((ad: any) => (
                            <AdCard key={ad._id} ad={ad} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-3 rounded-full border border-gray-100 text-[#1A3620] disabled:opacity-30 hover:bg-[#FFBA34] transition-colors"
                            >
                                <ChevronLeft size={20} strokeWidth={3} />
                            </button>
                            <span className="font-black text-sm uppercase tracking-widest text-[#1A3620]">
                                Page {page} <span className="text-gray-300 mx-2">/</span> {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-3 rounded-full border border-gray-100 text-[#1A3620] disabled:opacity-30 hover:bg-[#FFBA34] transition-colors"
                            >
                                <ChevronRight size={20} strokeWidth={3} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="py-24 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-black text-sm uppercase tracking-widest">Aucune annonce trouvée dans cette section</p>
                </div>
            )}
        </div>
    );
};

export default GenericListView;
