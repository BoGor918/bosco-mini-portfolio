
// others
import { lazy, Suspense, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// page components
import MainLoading from "./components/loading/MainLoading";
import { MapperContext } from "./globalVariable/MapperContextProvider";
import { translationKeys } from "./globalVariable/Translation";
// lazy load components
const Home = lazy(() => {
  return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    resolve(import('./components/home/Home'));
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
  const { t } = useContext(MapperContext);

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
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
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