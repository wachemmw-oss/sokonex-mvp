import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight, Sparkles, Plane, TrendingUp, Shirt, Sparkle, ShieldCheck, Zap
} from 'lucide-react';
import BannerCard from '../components/BannerCard';
import { useQuery } from '@tanstack/react-query';
import { getHomeSection } from '../services/ads';
import SectionBlock from '../components/SectionBlock';
import FlashCountdown from '../components/FlashCountdown';

const Home = () => {
    const navigate = useNavigate();
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
        }
    ];

    // Banner Logic
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused, banners.length]);

    useEffect(() => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            const bannerWidth = container.offsetWidth;
            container.scrollTo({ left: currentBanner * bannerWidth, behavior: 'smooth' });
        }
    }, [currentBanner]);

    // Data fetching (Parallel)
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
        <div className="font-sans min-h-screen pb-20 bg-white Outfit select-none">
            <div className="hidden md:block h-6 bg-[#FAFAFA]"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-0">
                {/* ─── Hero Banner ─── */}
                <div
                    className="relative w-full max-w-7xl mx-auto md:rounded-[2.5rem] overflow-hidden group mb-12 shadow-2xl shadow-blue-900/10"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div ref={carouselRef} className="flex overflow-x-auto scrollbar-hide snap-x h-full">
                        {banners.map((b, idx) => (
                            <div key={idx} className="min-w-full snap-center">
                                <BannerCard {...b} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-16">
                    {/* 1. Flash Deals Section */}
                    <SectionBlock
                        title="Offres Flash"
                        Icon={Zap}
                        seeMorePath="/results?sort=flash"
                        items={flashData?.data?.items || []}
                        loading={flashLoading}
                        iconBgColor="bg-red-100"
                        iconColor="text-red-600"
                        itemVariant="flash"
                    >
                        <FlashCountdown />
                    </SectionBlock>

                    {/* 2. Exclusive Selection */}
                    <SectionBlock
                        title="Sélection Exclusive"
                        Icon={Sparkles}
                        seeMorePath="/results?sort=exclusive"
                        items={exclusiveData?.data?.items || []}
                        loading={exclusiveLoading}
                        iconBgColor="bg-blue-100"
                        iconColor="text-blue-600"
                    />

                    {/* 3. Trending Section */}
                    <SectionBlock
                        title="Ça cartonne à Lushi"
                        Icon={TrendingUp}
                        seeMorePath="/results?sort=popular"
                        items={trendingData?.data?.items || []}
                        loading={trendingLoading}
                        iconBgColor="bg-orange-100"
                        iconColor="text-orange-500"
                    />

                    {/* 4. Universe Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SectionBlock
                            title="Univers Mode"
                            Icon={Shirt}
                            seeMorePath="/results?category=mode"
                            items={modeData?.data?.items?.slice(0, 4) || []}
                            loading={modeLoading}
                            iconBgColor="bg-indigo-50"
                            iconColor="text-indigo-600"
                        />
                        <SectionBlock
                            title="Univers Beauté"
                            Icon={Sparkle}
                            seeMorePath="/results?category=beaute"
                            items={beauteData?.data?.items?.slice(0, 4) || []}
                            loading={beauteLoading}
                            iconBgColor="bg-pink-50"
                            iconColor="text-pink-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
