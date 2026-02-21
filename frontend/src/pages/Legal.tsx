const Legal = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 font-sans pb-32">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Informations Légales</h1>

            {/* CGU Section */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Conditions Générales d'Utilisation (CGU)</h2>
                <div className="prose prose-sm text-gray-600 space-y-4 max-w-none">
                    <p>
                        Bienvenue sur SOKONEX. En accédant à ce site, vous acceptez de respecter les présentes conditions. SOKONEX est une plateforme de petites annonces en ligne gratuite destinée à faciliter la mise en relation entre vendeurs et acheteurs.
                    </p>
                    <div>
                        <h4 className="font-bold text-gray-800">1. Responsabilité du Contenu</h4>
                        <p>
                            L'utilisateur est seul responsable du contenu de ses annonces (textes, photos, prix). SOKONEX n'est pas responsable de l'exactitude des informations fournies par les utilisateurs.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">2. Transactions</h4>
                        <p>
                            SOKONEX n'intervient dans aucune transaction. Nous ne percevons aucune commission sur les ventes et ne garantissons pas la qualité des produits vendus. Les litiges doivent être résolus directement entre l'acheteur et le vendeur.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">3. Interdictions</h4>
                        <p>
                            Il est strictement interdit de publier des annonces pour des produits illégaux, contrefaits, dangereux ou à caractère pornographique. Toute tentative de fraude entraînera un bannissement immédiat.
                        </p>
                    </div>
                </div>
            </section>

            {/* Privacy Policy Section */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Politique de Confidentialité</h2>
                <div className="prose prose-sm text-gray-600 space-y-4 max-w-none">
                    <p>
                        Chez SOKONEX, nous respectons votre vie privée. Voici comment nous traitons vos données :
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Données collectées :</strong> Nous collectons votre nom, email et numéro de téléphone lors de la création de votre compte.</li>
                        <li><strong>Utilisation :</strong> Vos coordonnées (téléphone/WhatsApp) ne sont visibles que sur vos annonces pour permettre aux acheteurs de vous contacter.</li>
                        <li><strong>Sécurité :</strong> Vos mots de passe sont hachés et sécurisés. Nous ne vendons jamais vos données personnelles à des tiers.</li>
                        <li><strong>Cookies :</strong> Nous utilisons des cookies pour améliorer votre expérience de navigation et maintenir votre session connectée.</li>
                    </ul>
                </div>
            </section>

            {/* Contact Support */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-2">Une question juridique ?</p>
                <p className="font-bold text-gray-800">support@sokonex.com</p>
            </div>
        </div>
    );
};

export default Legal;
