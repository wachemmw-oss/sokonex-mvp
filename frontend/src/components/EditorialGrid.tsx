import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';

const articles = [
    {
        id: 1,
        title: "Comment choisir le smartphone idéal en 2026",
        desc: "Navigation le marché peut être écrasant. Voici notre guide complet...",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
        category: "Technologie",
        author: "Tech Expert",
        date: "2024-03-15",
        readTime: "8 min"
    },
    {
        id: 2,
        title: "Top tendances mode d'été à Lubumbashi",
        desc: "Des imprimés Kitenge vibrants aux ensembles en lin minimalistes...",
        image: "https://images.unsplash.com/photo-1445205174273-59396b299912?q=80&w=800&auto=format&fit=crop",
        category: "Mode",
        author: "Style Editor",
        date: "2024-03-10",
        readTime: "7 min"
    },
    {
        id: 3,
        title: "5 idées de déco pour petits appartements",
        desc: "Maximisez votre espace sans sacrifier le style. Nos astuces...",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
        category: "Maison & Jardin",
        author: "Interior Designer",
        date: "2024-03-05",
        readTime: "9 min"
    }
];

const EditorialGrid = () => {
    return (
        <section className="py-12">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-2">Contenu Éditorial</h2>
                <p className="text-gray-500 text-sm">Découvrez nos guides d'achat et sélections thématiques</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((a) => (
                    <div key={a.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#0F172A]">
                                {a.category}
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <span className="text-[10px] font-bold text-gray-400 capitalize">{a.author[0]}</span>
                                </div>
                                <span className="text-[11px] font-bold text-gray-500">{a.author} • {a.date}</span>
                            </div>
                            <h3 className="text-lg font-black text-[#0F172A] leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                {a.title}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-loose">
                                {a.desc}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold">{a.readTime} de lecture</span>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-[#E91E63] flex items-center gap-1.5 group-hover:gap-2 transition-all">
                                    Lire l'article
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EditorialGrid;
