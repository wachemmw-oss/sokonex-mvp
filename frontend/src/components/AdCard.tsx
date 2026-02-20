import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface AdCardProps {
    ad: any;
    promoted?: boolean;
}

const AdCard = ({ ad, promoted = false }: AdCardProps) => {
    return (
        <Link to={`/ad/${ad._id}`} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group transform hover:-translate-y-1">
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {ad.images?.[0] ? (
                    <img
                        src={ad.images[0].url}
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
                {promoted && (
                    <div className="absolute top-2 left-2 bg-gradient-orange text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm z-10">
                        Promo
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            <div className="p-3 flex flex-col flex-1 relative">
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {ad.title}
                </h3>
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1">
                        <p className="text-[#6A1B9A] font-extrabold text-lg">
                            {ad.priceType === 'fixed' || ad.priceType === 'negotiable'
                                ? `$${ad.price?.toLocaleString()}`
                                : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                        </p>
                        {(ad.priceType === 'fixed' || ad.priceType === 'negotiable') &&
                            <span className="text-[10px] text-gray-500 font-medium">USD</span>
                        }
                    </div>

                    <div className="flex items-center mt-2 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md w-fit">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        <span className="truncate max-w-[120px]">{ad.city}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AdCard;
