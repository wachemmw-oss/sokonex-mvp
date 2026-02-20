export const LOCATIONS = [
    { province: 'Kinshasa', cities: ['Kinshasa'] },
    { province: 'Kongo Central', cities: ['Matadi', 'Boma', 'Mbanza-Ngungu'] },
    { province: 'Kwango', cities: ['Kenge'] },
    { province: 'Kwilu', cities: ['Kikwit', 'Bandundu'] },
    { province: 'Mai-Ndombe', cities: ['Inongo'] },
    { province: 'Kasaï', cities: ['Tshikapa'] },
    { province: 'Kasaï Central', cities: ['Kananga'] },
    { province: 'Kasaï Oriental', cities: ['Mbuji-Mayi'] },
    { province: 'Lomami', cities: ['Kabinda', 'Mwene-Ditu'] },
    { province: 'Sankuru', cities: ['Lusambo'] },
    { province: 'Maniema', cities: ['Kindu'] },
    { province: 'Sud-Kivu', cities: ['Bukavu', 'Uvira'] },
    { province: 'Nord-Kivu', cities: ['Goma', 'Butembo', 'Beni'] },
    { province: 'Ituri', cities: ['Bunia'] },
    { province: 'Haut-Uele', cities: ['Isiro'] },
    { province: 'Bas-Uele', cities: ['Buta'] },
    { province: 'Tshopo', cities: ['Kisangani'] },
    { province: 'Haut-Lomami', cities: ['Kamina'] },
    { province: 'Lualaba', cities: ['Kolwezi'] },
    { province: 'Haut-Katanga', cities: ['Lubumbashi', 'Likasi'] },
    { province: 'Tanganyika', cities: ['Kalemie'] },
    { province: 'Mongala', cities: ['Lisala', 'Bumba'] },
    { province: 'Nord-Ubangi', cities: ['Gbadolite'] },
    { province: 'Sud-Ubangi', cities: ['Gemena'] },
    { province: 'Équateur', cities: ['Mbandaka'] },
    { province: 'Tshuapa', cities: ['Boende'] }
];

// Helper to flatten for easy search
export const CITIES_FLAT = LOCATIONS.flatMap(l => l.cities.map(c => ({ city: c, province: l.province })));
