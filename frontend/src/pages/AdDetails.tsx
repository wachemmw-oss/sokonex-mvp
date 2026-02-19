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
                        <h1 className="text-3xl font-bold mb-2">{ad.title}</h1>
                        <span className="text-xl font-bold text-green-600">${ad.price}</span>
                    </div>

                    <div className="flex gap-2 text-sm text-gray-500 mb-6">
                        <span>{ad.city}, {ad.province}</span>
                        <span>•</span>
                        <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="prose max-w-none">
                        <p>{ad.description}</p>
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <h3 className="font-bold mb-2">Vendeur</h3>
                        <p>{ad.sellerId?.email || 'Vendeur'}</p>
                        {ad.sellerId?.showPhone && ad.sellerId?.phone && (
                            <p className="font-mono bg-yellow-100 inline-block px-2 py-1 mt-2">{ad.sellerId.phone}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetails;
