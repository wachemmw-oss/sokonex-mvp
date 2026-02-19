import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Bienvenue sur SOKONEX</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/results?category=immobilier" className="p-4 bg-white shadow rounded hover:bg-gray-100">Immobilier</Link>
                <Link to="/results?category=vehicules" className="p-4 bg-white shadow rounded hover:bg-gray-100">Véhicules</Link>
                <Link to="/results?category=electronique" className="p-4 bg-white shadow rounded hover:bg-gray-100">Électronique</Link>
                <Link to="/results" className="p-4 bg-blue-600 text-white shadow rounded hover:bg-blue-700">Tout voir</Link>
            </div>
        </div>
    );
};

export default Home;
