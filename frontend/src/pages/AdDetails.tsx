import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../services/ads';

const AdDetails = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['ad', id],
        queryFn: () => getAdById(id as string),
        enabled: !!id
    });

    if (isLoading) return <div className="p-8">Chargement...</div>;
    if (error || !data?.success) return <div className="p-8 text-red-500">Erreur impossible de charger l'annonce</div>;

    const ad = data.data;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white shadow rounded overflow-hidden">
                {/* Image Gallery Placeholder */}
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {ad.images?.[0] ? <img src={ad.images[0].url} alt={ad.title} className="h-full object-cover" /> : 'Pas d\'image'}
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">{ad.title}</h1>
                        <span className="text-xl font-bold text-green-600">
                            {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` :
                                ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                        </span>
                    </div>

                    <div className="flex gap-2 text-sm text-gray-500 mb-6">
                        <span className="bg-gray-100 px-2 py-1 rounded">{ad.subCategory}</span>
                        <span>•</span>
                        <span>{ad.city}, {ad.province}</span>
                        <span>•</span>
                        <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Dynamic Attributes */}
                    {ad.attributes && Object.keys(ad.attributes).length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            {Object.entries(ad.attributes).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">{key.replace('attr_', '')}</span>
                                    <span className="font-medium text-gray-800">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="prose max-w-none mb-8 text-gray-700 whitespace-pre-line">
                        {ad.description}
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <h3 className="font-bold text-lg mb-4">Vendeur</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                {ad.sellerId?.name?.charAt(0) || 'V'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{ad.sellerId?.name || 'Vendeur'}</p>
                                <p className="text-sm text-gray-500">Membre depuis {new Date(ad.sellerId?.createdAt || Date.now()).getFullYear()}</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {ad.sellerId?.showPhone && ad.sellerId?.isPhoneVerified && ad.sellerId?.phone && (
                                <a href={`tel:${ad.sellerId.phone}`} className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                                    Appeler {ad.sellerId.phone}
                                </a>
                            )}
                            {ad.sellerId?.whatsapp && (
                                <a href={`https://wa.me/${ad.sellerId.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition">
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetails;
