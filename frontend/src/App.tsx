import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomTab from './components/BottomTab';
import Footer from './components/Footer';

// Lazy-loaded pages — each is only downloaded when visited
const Home = lazy(() => import('./pages/Home'));
const Results = lazy(() => import('./pages/Results'));
const PostAd = lazy(() => import('./pages/PostAd'));
const AdDetails = lazy(() => import('./pages/AdDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminReports = lazy(() => import('./pages/AdminReports'));
const AdminCategories = lazy(() => import('./pages/AdminCategories'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const Aide = lazy(() => import('./pages/Aide'));
const Legal = lazy(() => import('./pages/Legal'));
const Store = lazy(() => import('./pages/Store'));


// Global query client — stale cache: data considered fresh for 2 min
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,        // 2 min: no refetch if data is fresh
      gcTime: 1000 * 60 * 10,           // 10 min: keep in memory
      refetchOnWindowFocus: false,       // no refetch when switching tabs
      retry: 1,
    },
  },
});

// Minimal skeleton shown while a lazy page loads
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#214829] rounded-full animate-spin" />
      <span className="text-sm text-gray-400 font-medium">Chargement...</span>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white text-gray-900 font-sans">
            <AppContent />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  // Note: For better reactive behavior, we should use useLocation() from react-router-dom, 
  // but App is the top-level. I'll move the Router content to a sub-component.

  return (
    <>
      {!isAdminPage && <Navbar />}
      <div className={!isAdminPage ? "pb-[60px] md:pb-0" : ""}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/ad/:id" element={<AdDetails />} />
            <Route path="/post" element={<PostAd />} />
            <Route path="/edit-ad/:id" element={<PostAd />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account/*" element={<Dashboard />} />
            <Route path="/store/:id" element={<Store />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="/aide" element={<Aide />} />
            <Route path="/legal" element={<Legal />} />
          </Routes>
        </Suspense>
      </div>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <BottomTab />}
    </>
  );
}


export default App;
