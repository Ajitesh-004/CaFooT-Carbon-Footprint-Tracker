import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from './atoms/userAtom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Register = lazy(() => import('./pages/Register'));
const EmissionsCalculator = lazy(() => import('./pages/EmissionsCalculator'));
const Analysis = lazy(() => import('./pages/AnalysisPage'));
const Community = lazy(() => import('./pages/CommunityPage'));

// ProtectedRoute Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useRecoilValue(userAtom);
  return user ? children : <Navigate to="/login" replace />;
};

// PublicRoute Component
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const user = useRecoilValue(userAtom);
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <ScrollToTop />
      <div className="pt-16">
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracker"
              element={
                <ProtectedRoute>
                  <EmissionsCalculator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <Analysis />
                </ProtectedRoute>
              }
            />

            {/* Catch-All */}
            <Route
              path="*"
              element={
                <Navigate to={user ? "/dashboard" : "/"} replace />
              }
            />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
        }}
      />
    </div>
  );
}

export default App;