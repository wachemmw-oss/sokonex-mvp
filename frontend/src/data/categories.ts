export const CATEGORIES = [
    {
        id: 'immobilier',
        label: 'Immobilier',
        icon: 'Home',
        subCategories: [
            { id: 'maisons-a-vendre', label: 'Maisons à vendre' },
            { id: 'maisons-a-louer', label: 'Maisons à louer' },
            { id: 'parcelles-terrains', label: 'Parcelles & Terrains' },
            { id: 'chambres-a-louer', label: 'Chambres à louer' },
            { id: 'espaces-commerciaux', label: 'Espaces commerciaux' },
            { id: 'locations-journalieres', label: 'Locations journalières' },
        ],
        attributes: [
            { id: 'saleType', label: 'Type', type: 'select', options: ['sell', 'rent'] },
            { id: 'propertyType', label: 'Type de bien', type: 'select', options: ['house', 'apartment', 'land', 'commercial', 'room'] },
            { id: 'emptyLand', label: 'Terrain nu', type: 'boolean' },
            { id: 'area', label: 'Surface (m²)', type: 'number' },
            { id: 'bedrooms', label: 'Chambres', type: 'number' },
            { id: 'bathrooms', label: 'Salles de bain', type: 'number' },
            { id: 'furnished', label: 'Meublé', type: 'boolean' },
            { id: 'parking', label: 'Parking', type: 'boolean' },
        ]
    },
    {
        id: 'vehicules',
        label: 'Véhicules & Transport',
        icon: 'Car',
        subCategories: [
            { id: 'voitures', label: 'Voitures' },
            { id: 'motos', label: 'Motos' },
            { id: 'bus-camions', label: 'Bus & Camions' },
            { id: 'pieces-detachees', label: 'Pièces détachées' },
            { id: 'engins-chantier', label: 'Engins de chantier' },
            { id: 'bateaux-pirogues', label: 'Bateaux / Pirogues' },
        ],
        attributes: [
            { id: 'brand', label: 'Marque', type: 'text' }, // Could be select in V2
            { id: 'model', label: 'Modèle', type: 'text' },
            { id: 'year', label: 'Année', type: 'number' },
            { id: 'mileage', label: 'Kilométrage', type: 'number' },
            { id: 'fuel', label: 'Carburant', type: 'select', options: ['essence', 'diesel', 'hybride', 'electrique'] },
            { id: 'gearbox', label: 'Boîte de vitesse', type: 'select', options: ['manuelle', 'automatique'] },
        ]
    },
    {
        id: 'electronique',
        label: 'Téléphones & Électronique',
        icon: 'Smartphone',
        subCategories: [
            { id: 'smartphones', label: 'Smartphones' },
            { id: 'telephones-simples', label: 'Téléphones simples' },
            { id: 'ordinateurs', label: 'Ordinateurs' },
            { id: 'televisions', label: 'Télévisions' },
            { id: 'accessoires', label: 'Accessoires' },
            { id: 'electromenager', label: 'Électroménager' },
        ],
        attributes: [
            { id: 'brand', label: 'Marque', type: 'text' },
            { id: 'storage', label: 'Stockage (GB)', type: 'number' },
            { id: 'ram', label: 'RAM (GB)', type: 'number' },
            { id: 'warranty', label: 'Garantie', type: 'boolean' },
        ]
    },
    {
        id: 'commerce',
        label: 'Commerce & Business',
        icon: 'Building2',
        subCategories: [
            { id: 'fonds-commerce', label: 'Fonds de commerce' },
            { id: 'materiel-boutique', label: 'Matériel de boutique' },
            { id: 'materiel-restaurant', label: 'Matériel de restaurant' },
            { id: 'stock-gros', label: 'Stock en gros' },
            { id: 'investissement', label: 'Opportunités d\'investissement' },
        ]
    },
    {
        id: 'mode',
        label: 'Mode & Beauté',
        icon: 'Shirt',
        subCategories: [
            { id: 'vetements-femme', label: 'Vêtements femme' },
            { id: 'vetements-homme', label: 'Vêtements homme' },
            { id: 'chaussures', label: 'Chaussures' },
            { id: 'sacs', label: 'Sacs' },
            { id: 'montres-bijoux', label: 'Montres & bijoux' },
            { id: 'beaute-soins', label: 'Produits de beauté & soins' },
            { id: 'cheveux', label: 'Cheveux (perruques, mèches)' },
            { id: 'cosmetiques', label: 'Cosmétiques & maquillage' },
            { id: 'parfums', label: 'Parfums & déodorants' },
            { id: 'soins-traditionnels', label: 'Soins traditionnels' },
            { id: 'onglerie', label: 'Onglerie & accessoires' },
        ],
        attributes: [
            { id: 'type', label: 'Type', type: 'text' },
            { id: 'size', label: 'Taille/Pointure', type: 'text' },
            { id: 'brand', label: 'Marque', type: 'text' },
            { id: 'gender', label: 'Genre', type: 'select', options: ['homme', 'femme', 'unisex', 'enfant'] },
        ]
    },
    {
        id: 'maison',
        label: 'Maison & Construction',
        icon: 'Sofa',
        subCategories: [
            { id: 'meubles', label: 'Meubles' },
            { id: 'materiaux', label: 'Matériaux de construction' },
            { id: 'plomberie', label: 'Plomberie' },
            { id: 'electricite', label: 'Électricité' },
            { id: 'carrelage', label: 'Carrelage' },
            { id: 'outils', label: 'Outils' },
        ]
    },
    {
        id: 'enfants',
        label: 'Enfants & Famille',
        icon: 'Baby',
        subCategories: [
            { id: 'vetements-enfants', label: 'Vêtements enfants' },
            { id: 'fournitures-scolaires', label: 'Fournitures scolaires' },
            { id: 'jouets', label: 'Jouets' },
            { id: 'poussettes', label: 'Poussettes' },
        ]
    },
    {
        id: 'emploi',
        label: 'Emploi & Services',
        icon: 'Briefcase',
        subCategories: [
            { id: 'offres-emploi', label: 'Offres d\'emploi' },
            { id: 'recherche-emploi', label: 'Recherche d\'emploi' },
            { id: 'services-domicile', label: 'Services à domicile' },
            { id: 'reparations', label: 'Réparations' },
            { id: 'transport-livraison', label: 'Transport & livraison' },
            { id: 'formation', label: 'Formation' },
        ],
        attributes: [
            { id: 'serviceType', label: 'Type', type: 'select', options: ['offer', 'search', 'service'] },
            { id: 'contract', label: 'Contrat', type: 'select', options: ['cdi', 'cdd', 'interim', 'freelance', 'stage'] },
        ]
    },
    {
        id: 'agriculture',
        label: 'Agriculture & Élevage',
        icon: 'MoreHorizontal',
        subCategories: [
            { id: 'animaux', label: 'Animaux' },
            { id: 'produits-agricoles', label: 'Produits agricoles' },
            { id: 'materiel-agricole', label: 'Matériel agricole' },
            { id: 'semences', label: 'Semences' },
        ]
    },
    {
        id: 'loisirs',
        label: 'Loisirs',
        icon: 'Bike',
        subCategories: [
            { id: 'jeux-video', label: 'Jeux vidéo' },
            { id: 'sport', label: 'Sport' },
            { id: 'instruments', label: 'Instruments de musique' },
        ]
    },
];
