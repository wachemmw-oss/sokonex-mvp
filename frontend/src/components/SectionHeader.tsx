import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    Icon: LucideIcon;
    seeMorePath: string;
    iconBgColor?: string;
    iconColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    Icon,
    seeMorePath,
    iconBgColor = 'bg-blue-50',
    iconColor = 'text-blue-600'
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${iconBgColor} ${iconColor} flex items-center justify-center shadow-sm`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#0F172A] Outfit">
                    {title}
                </h2>
            </div>
            <Link
                to={seeMorePath}
                className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
                Voir tout
                <ChevronRight size={16} strokeWidth={3} />
            </Link>
        </div>
    );
};

export default SectionHeader;
