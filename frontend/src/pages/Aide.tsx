import { Info, HelpCircle, DollarSign, CheckCircle2, ShieldCheck, Truck, CreditCard, MessageCircle } from 'lucide-react';

const Aide = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 font-sans pb-32">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Informations Pratiques & Aide</h1>
                <p className="text-gray-600">Tout ce que vous devez savoir pour réussir sur SOKONEX.</p>
            </div>

            {/* Comment gagner de l'argent section */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#D32F2F] rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Comment gagner de l'argent sur SOKONEX ?</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" /> Vendez ce que vous n'utilisez plus
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            C'est le moyen le plus simple. Vêtements, électronique, meubles... Donnez une seconde vie à vos objets et transformez-les en cash instantanément.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" /> Devenez un vendeur régulier
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Beaucoup d'utilisateurs sourcent des produits pour les revendre sur SOKONEX. C'est une excellente plateforme pour lancer votre petit commerce sans frais de boutique physique.
                        </p>
                    </div>
                </div>

                <div className="mt-8 bg-[#EBF5EE] p-6 rounded-lg border border-[#214829]/10">
                    <h3 className="font-bold text-[#1A3620] mb-4 uppercase tracking-wider text-sm">Le processus étape par étape :</h3>
                    <div className="space-y-4">
                        {[
                            { step: 1, title: 'Créez votre compte', desc: 'Inscrivez-vous gratuitement avec votre numéro de téléphone ou votre email.' },
                            { step: 2, title: 'Prenez de belles photos', desc: 'Un produit bien mis en valeur se vend 3 fois plus vite. Utilisez la lumière du jour.' },
                            { step: 3, title: 'Rédigez une annonce claire', desc: 'Donnez tous les détails : prix, état du produit, et localisation précise.' },
                            { step: 4, title: 'Répondez aux acheteurs', desc: 'Restez réactif sur WhatsApp ou par appel. La rapidité est la clé de la vente.' },
                            { step: 5, title: 'Concluez la vente', desc: 'Rencontrez l\'acheteur, faites vérifier l\'article et recevez votre paiement.' },
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#214829] text-white flex items-center justify-center font-bold text-sm">
                                    {item.step}
                                </span>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Foire Aux Questions (FAQ)</h2>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            q: "Est-ce que SOKONEX gère la livraison ?",
                            a: "Non. SOKONEX est une plateforme de mise en relation. Nous ne prenons pas de commandes et nous ne gérons pas le transit des produits. L'acheteur contacte lui-même le vendeur pour se fixer un moyen et un lieu de livraison.",
                            icon: <Truck className="w-5 h-5 text-blue-500" />
                        },
                        {
                            q: "Comment se passe le paiement ?",
                            a: "Le paiement se fait directement entre l'acheteur et le vendeur. Nous vous conseillons vivement de ne payer qu'après avoir vu et vérifié l'article en personne. SOKONEX n'intervient jamais dans les transactions financières.",
                            icon: <CreditCard className="w-5 h-5 text-green-500" />
                        },
                        {
                            q: "Pourquoi mon annonce a-t-elle été refusée ?",
                            a: "Toutes les annonces passent par une équipe de modération. Si votre annonce contient des produits interdits, des propos inappropriés ou si elle est considérée comme une arnaque, elle sera supprimée.",
                            icon: <ShieldCheck className="w-5 h-5 text-red-500" />
                        },
                        {
                            q: "Comment contacter un vendeur ?",
                            a: "Sur chaque page d'annonce, vous trouverez deux boutons : 'Appeler' et 'WhatsApp'. Cliquez simplement dessus pour entrer en contact direct avec la personne.",
                            icon: <MessageCircle className="w-5 h-5 text-[#214829]" />
                        }
                    ].map((item, i) => (
                        <div key={i} className="border border-gray-100 rounded-lg p-5 hover:bg-gray-50 transition">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">{item.icon}</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">{item.q}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tips for Safety */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-6 h-6 text-red-600" />
                    <h3 className="font-bold text-red-800">Règle d'or de sécurité</h3>
                </div>
                <p className="text-sm text-red-700">
                    N'envoyez JAMAIS d'argent à l'avance (frais de transport, réservation...) sans avoir tenu l'article entre vos mains. Rencontrez toujours le vendeur dans un lieu public et fréquenté.
                </p>
            </div>
        </div>
    );
};

export default Aide;
