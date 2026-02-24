import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home as HomeIcon, Car, Smartphone, Sofa, Shirt, Bike,
    Briefcase, Building2, Baby, MoreHorizontal, ChevronRight,
    Clock, LayoutGrid, List
} from 'lucide-react';
import AdCard from '../components/AdCard';
import BannerCard from '../components/BannerCard';
import { useQuery } from '@tanstack/react-query';
import { getHomeSection } from '../services/ads';
import SectionBlock from '../components/SectionBlock';

const Home = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentBanner, setCurrentBanner] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const banners = [
        {
            title: "Nouvelle Collection Gaming 2026",
            subtitle: "Exclusivité SOKONEX",
            description: "Découvrez les meilleures chaises et accessoires gaming pour une expérience immersive.",
            ctaText: "Acheter maintenant",
            ctaLink: "/results?q=gaming",
            image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-slate-50",
            dark: false
        },
        {
            title: "Votre Maison, Votre Style",
            subtitle: "Déco & Mobilier",
            description: "Une large gamme de meubles d'occasion et neufs pour sublimer votre intérieur.",
            ctaText: "Explorer",
            ctaLink: "/results?category=maison-meubles",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-[#1A3620]",
            dark: true,
            reverse: true
        },
        {
            title: "Électronique Haute Performance",
            subtitle: "Tech & Gadgets",
            description: "Smartphones, ordinateurs et accessoires tech aux meilleurs prix du marché.",
            ctaText: "Découvrir",
            ctaLink: "/results?category=electronique",
            image: "https://images.unsplash.com/photo-1526738549149-8e07eca2c1b4?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-[#FFBA34]",
            dark: false
        },
        {
            title: "Vendez en un Eclair !",
            subtitle: "Marketplace SOKONEX",
            description: "Publiez votre annonce gratuitement et touchez des milliers d'acheteurs en RDC.",
            ctaText: "Vendre maintenant",
            ctaLink: "/post",
            image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-slate-900",
            dark: true,
            reverse: true
        },
        {
            title: "Vêtements & Accessoires",
            subtitle: "Mode & Beauté",
            description: "Rafraîchissez votre garde-robe avec les dernières tendances de notre communauté.",
            ctaText: "Voir la mode",
            ctaLink: "/results?category=mode",
            image: "https://images.unsplash.com/photo-1445205174273-59396b299912?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-[#EBF5EE]",
            dark: false
        }
    ];

    // Banner Auto-play Logic
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000); // 5 seconds per banner

        return () => clearInterval(interval);
    }, [isPaused, banners.length]);

    // Scroll to active banner
    useEffect(() => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            const bannerWidth = container.offsetWidth;
            container.scrollTo({
                left: currentBanner * bannerWidth,
                behavior: 'smooth'
            });
        }
    }, [currentBanner]);

    // Fetch 5 sections in parallel
    const { data: flashData, isLoading: flashLoading } = useQuery({
        queryKey: ['home', 'flash'],
        queryFn: () => getHomeSection('flash'),
    });

    const { data: exclusiveData, isLoading: exclusiveLoading } = useQuery({
        queryKey: ['home', 'exclusive'],
        queryFn: () => getHomeSection('exclusive'),
    });

    const { data: trendingData, isLoading: trendingLoading } = useQuery({
        queryKey: ['home', 'trending'],
        queryFn: () => getHomeSection('trending'),
    });

    const { data: modeData, isLoading: modeLoading } = useQuery({
        queryKey: ['home', 'mode'],
        queryFn: () => getHomeSection('mode'),
    });

    const { data: beauteData, isLoading: beauteLoading } = useQuery({
        queryKey: ['home', 'beaute'],
        queryFn: () => getHomeSection('beaute'),
    });

    return (
        <div className="font-sans min-h-screen pb-20 bg-white">
            {/* Desktop Spacer */}
            <div className="hidden md:block h-6 bg-[#FAFAFA]"></div>

            <div className="max-w-7xl mx-auto px-4">

                {/* ─── Hero Banner Section (Premium Auto-play Carousel) ─── */}
                <div
                    className="relative w-full max-w-7xl mx-auto md:rounded-[2rem] overflow-hidden group mb-8"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        ref={carouselRef}
                        className="flex gap-0 overflow-x-auto scrollbar-hide snap-x h-full no-scrollbar"
                    >
                        {banners.map((b, idx) => (
                            <div key={idx} className="min-w-full snap-center">
                                <BannerCard {...b} />
                            </div>
                        ))}
                    </div>

                    {/* Premium Navigation Arrows (PC only) */}
                    <button
                        onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                        className="absolute left-10 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 backdrop-blur-sm text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110 hidden lg:flex"
                    >
                        <ChevronRight className="rotate-180" size={20} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                        className="absolute right-10 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 backdrop-blur-sm text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110 hidden lg:flex"
                    >
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </button>

                    {/* Premium Carousel Dots */}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2.5 z-30">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentBanner(idx)}
                                className={`h-1.5 transition-all duration-700 rounded-full ${currentBanner === idx
                                    ? 'w-10 bg-[#FFBA34] shadow-[0_0_15px_rgba(255,186,52,0.6)]'
                                    : 'w-1.5 bg-white/20 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to banner ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* ─── Product Sections ─── */}
                <div className="space-y-4">
                    <SectionBlock
                        title="⚡ Offres Flash du Jour"
                        seeMorePath="/offres-flash"
                        items={flashData?.data?.items || []}
                        loading={flashLoading}
                    />
                    <SectionBlock
                        title="💎 Sélection Exclusive"
                        seeMorePath="/selection-exclusive"
                        items={exclusiveData?.data?.items || []}
                        loading={exclusiveLoading}
                    />
                    <SectionBlock
                        title="🔥 Ça cartonne à Lushi"
                        seeMorePath="/tendance-lushi"
                        items={trendingData?.data?.items || []}
                        loading={trendingLoading}
                    />
                    <SectionBlock
                        title="👗 Univers Mode"
                        seeMorePath="/univers/mode"
                        items={modeData?.data?.items || []}
                        loading={modeLoading}
                    />
                    <SectionBlock
                        title="💄 Univers Beauté"
                        seeMorePath="/univers/beaute"
                        items={beauteData?.data?.items || []}
                        loading={beauteLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
