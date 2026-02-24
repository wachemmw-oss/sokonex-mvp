import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const FlashCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({ hrs: 12, min: 37, sec: 15 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.sec > 0) return { ...prev, sec: prev.sec - 1 };
                if (prev.min > 0) return { ...prev, min: prev.min - 1, sec: 59 };
                if (prev.hrs > 0) return { hrs: prev.hrs - 1, min: 59, sec: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-white/20 backdrop-blur-md rounded-lg w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-white text-lg md:text-2xl font-black shadow-inner border border-white/10">
                {value.toString().padStart(2, '0')}
            </div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/80 mt-1">{label}</span>
        </div>
    );

    return (
        <div className="bg-gradient-to-r from-[#F97316] to-[#EF4444] rounded-xl md:rounded-3xl p-3 md:p-6 mb-8 shadow-xl shadow-orange-500/20 flex flex-row items-center justify-between gap-2 md:gap-6 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>

            <div className="flex items-center gap-2 md:gap-4 relative z-10">
                <div className="bg-white/20 p-2 md:p-3 rounded-full text-white animate-pulse">
                    <Clock size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-white text-xs md:text-xl font-black uppercase tracking-tight leading-none">Offres limitées</h3>
                    <p className="text-white/80 text-[8px] md:text-xs font-bold mt-1 hidden md:block">Les offres se terminent bientôt.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 relative z-10 shrink-0">
                <TimeUnit value={timeLeft.hrs} label="hrs" />
                <span className="text-white font-black text-sm md:text-xl mb-3 md:mb-4">:</span>
                <TimeUnit value={timeLeft.min} label="min" />
                <span className="text-white font-black text-sm md:text-xl mb-3 md:mb-4">:</span>
                <TimeUnit value={timeLeft.sec} label="sec" />
            </div>
        </div>
    );
};

export default FlashCountdown;
