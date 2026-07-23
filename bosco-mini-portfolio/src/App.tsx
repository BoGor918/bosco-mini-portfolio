
// others
import { lazy, Suspense, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// page components
import MainLoading from "./components/loading/MainLoading";
import { MapperContext } from "./globalVariable/MapperContextProvider";
import { translationKeys } from "./globalVariable/Translation";
// lazy load components
const Home = lazy(() => {
  return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    resolve(import('./pages/Home'));
  });
});
const Login = lazy(() => {
  return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    resolve(import('./pages/Login'));
  });
});
const Dashboard = lazy(() => {
  return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    resolve(import('./pages/Dashboard'));
  });
});

function AppContent() {
  const { t, user } = useContext(MapperContext);

  useEffect(() => {
    document.title = t(translationKeys.boscoPortfolio);

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", t(translationKeys.introModalDescription));
    }
  }, [t]);

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
      <AppContent />
    </Router>
  );
}

export default App;