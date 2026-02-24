import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, ShieldCheck } from 'lucide-react';
import logo from '../assets/sokonex-best-logo.png';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white pt-16 pb-8 font-sans">
            {/* Decorative orbs */}
            <div className="relative overflow-hidden">
                <div className="absolute -top-20 right-0 w-80 h-80 bg-[#D32F2F]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/3 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <Link to="/" className="inline-block">
                                <img src={logo} alt="SOKONEX Logo" className="h-10 w-auto brightness-0 invert" />
                            </Link>
                            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                                Votre marketplace de confiance en RDC. Vendez, achetez et échangez en toute sécurité sur SOKONEX.
                            </p>
                            {/* Verified badge */}
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                                <ShieldCheck className="w-4 h-4 text-[#D32F2F]" />
                                <span className="text-xs font-bold text-white/70">Marketplace Sécurisée</span>
                            </div>
                            <div className="flex gap-3">
                                <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#D32F2F]/20 hover:text-[#D32F2F] transition-all">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#D32F2F]/20 hover:text-[#D32F2F] transition-all">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#D32F2F]/20 hover:text-[#D32F2F] transition-all">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links - Help */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-white/40">Aide & Info</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/aide" className="text-sm text-white/60 hover:text-[#D32F2F] transition-colors font-medium">Informations Pratiques</Link>
                                </li>
                                <li>
                                    <Link to="/aide" className="text-sm text-white/60 hover:text-[#D32F2F] transition-colors font-medium">Foire aux questions (FAQ)</Link>
                                </li>
                                <li>
                                    <Link to="/aide" className="text-sm text-white/60 hover:text-[#D32F2F] transition-colors font-medium">Comment gagner de l'argent ?</Link>
                                </li>
                                <li>
                                    <Link to="/post" className="text-sm text-white/60 hover:text-[#D32F2F] transition-colors font-medium">Publier une annonce</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Links - Legal */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-white/40">Légal</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/legal" className="text-sm text-white/60 hover:text-[#D32F2F] transition-colors font-medium">Conditions d'Utilisation (CGU)</Link>
                                </li>
                                <li>
                                    <Link to="/legal" className="text-sm text-white/60 hover:text-[#D32F2F] transition-colors font-medium">Politique de Confidentialité</Link>
                                </li>
                                <li>
                                    <Link to="/legal" className="text-sm text-white/60 hover:text-[#D32F2F] transition-colors font-medium">Mentions Légales</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Section */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-white/40">Contact</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-white/60">
                                    <Phone className="w-4 h-4 text-[#D32F2F] shrink-0" />
                                    <span>+243 (0) 00 000 000</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/60">
                                    <Mail className="w-4 h-4 text-[#D32F2F] shrink-0" />
                                    <span>contact@sokonex.com</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white/60">
                                    <MapPin className="w-4 h-4 text-[#D32F2F] shrink-0" />
                                    <span>Kinshasa, RD Congo</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-white/30">
                            &copy; {new Date().getFullYear()} SOKONEX Marketplace. Tous droits réservés.
                        </p>
                        <div className="flex gap-6 text-xs text-white/30">
                            <span>Fait avec ❤️ à Kinshasa</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
