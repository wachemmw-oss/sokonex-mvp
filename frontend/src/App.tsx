import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
// Pages (Placeholders for now)
import Home from './pages/Home';
import Results from './pages/Results';
import PostAd from './pages/PostAd';
import AdDetails from './pages/AdDetails';
import Navbar from './components/Navbar';
import BottomTab from './components/BottomTab';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />
            <div className="pb-[60px] md:pb-0"> {/* Add padding for bottom tab on mobile */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<Results />} />
                <Route path="/ad/:id" element={<AdDetails />} />
                <Route path="/post" element={<PostAd />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account/*" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </div>
            <BottomTab />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
