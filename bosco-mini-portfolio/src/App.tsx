
// others
import { lazy, Suspense, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// page components
import MainLoading from "./components/loading/MainLoading";
import { MapperContext } from "./globalVariable/MapperContextProvider";
import { NavigationLoadingProvider, useNavigationLoading } from "./globalVariable/NavigationLoading";
import { translationKeys } from "./globalVariable/Translation";
// lazy load components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function AppContent() {
  const { t, user, authLoading } = useContext(MapperContext);
  const { isNavigating } = useNavigationLoading();

  useEffect(() => {
    document.title = t(translationKeys.boscoPortfolio);

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", t(translationKeys.introModalDescription));
    }
  }, [t]);

  if (authLoading || isNavigating) {
    return <MainLoading />;
  }

  return (
    <Suspense fallback={<MainLoading />}>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <NavigationLoadingProvider>
        <AppContent />
      </NavigationLoadingProvider>
    </Router>
  );
}

export default App;