import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Award, CreditCard } from 'lucide-react';

const services = [
    {
        icon: ShieldCheck,
        title: "Paiement Sécurisé",
        desc: "Transactions 100% sécurisées",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        icon: Truck,
        title: "Livraison Suivie",
        desc: "Suivez votre commande en temps réel",
        color: "text-green-600",
        bg: "bg-green-50"
    },
    {
        icon: RotateCcw,
        title: "Retours Faciles",
        desc: "Retours gratuits sous 14 jours",
        color: "text-orange-600",
        bg: "bg-orange-50"
    },
    {
        icon: Headphones,
        title: "Service Client",
        desc: "Assistance disponible 7j/7",
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        icon: Award,
        title: "Garantie Qualité",
        desc: "Produits vérifiés et garantis",
        color: "text-yellow-600",
        bg: "bg-yellow-50"
    },
    {
        icon: CreditCard,
        title: "Paiements Multiples",
        desc: "Plusieurs modes acceptés",
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    }
];

const ServiceGrid = () => {
    return (
        <section className="py-12 bg-gray-50/50 rounded-[2rem] border border-gray-100 my-12">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-2">Confiance & Sécurité</h2>
                <p className="text-gray-500 text-sm md:text-base">Nous nous engageons à vous offrir la meilleure expérience d'achat</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                {services.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-xl ${s.bg} ${s.color} mb-4`}>
                            <s.icon size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="font-bold text-[#0F172A] mb-1">{s.title}</h3>
                        <p className="text-xs text-gray-500">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ServiceGrid;
