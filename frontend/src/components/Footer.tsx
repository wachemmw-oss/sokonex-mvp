import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import logo from '../assets/sokonex-best-logo.png';

const Footer = () => {
    return (
        <footer className="hidden md:block bg-[#1A3620] text-[#FAFAF8] pt-16 pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <img src={logo} alt="SOKONEX Logo" className="h-10 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
                            Votre marketplace de confiance en RDC. Vendez, achetez et épargnez en toute sécurité sur SOKONEX.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                                <Facebook className="w-5 h-5 text-gray-300" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                                <Instagram className="w-5 h-5 text-gray-300" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                                <Twitter className="w-5 h-5 text-gray-300" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links - Help */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Aide & Info</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/aide" className="text-sm text-gray-400 hover:text-[#FFBA34] transition">Informations Pratiques</Link>
                            </li>
                            <li>
                                <Link to="/aide" className="text-sm text-gray-400 hover:text-[#FFBA34] transition">Foire aux questions (FAQ)</Link>
                            </li>
                            <li>
                                <Link to="/aide" className="text-sm text-gray-400 hover:text-[#FFBA34] transition">Comment gagner de l'argent ?</Link>
                            </li>
                            <li>
                                <Link to="/post" className="text-sm text-gray-400 hover:text-[#FFBA34] transition">Publier une annonce</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links - Legal */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Légal</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/legal" className="text-sm text-gray-400 hover:text-[#FFBA34] transition">Conditions d'Utilisation (CGU)</Link>
                            </li>
                            <li>
                                <Link to="/legal" className="text-sm text-gray-400 hover:text-[#FFBA34] transition">Politique de Confidentialité</Link>
                            </li>
                            <li>
                                <Link to="/legal" className="text-sm text-gray-400 hover:text-[#FFBA34] transition">Mentions Légales</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone className="w-4 h-4 text-[#FFBA34]" />
                                <span>+243 (0) 00 000 000</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail className="w-4 h-4 text-[#FFBA34]" />
                                <span>contact@sokonex.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-[#FFBA34]" />
                                <span>Kinshasa, RD Congo</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} SOKONEX Marketplace. Tous droits réservés.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        <span>Fait avec ❤️ à Kinshasa</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
