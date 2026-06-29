
// others
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// page components
import MainLoading from "./components/loading/MainLoading";
// lazy load components
const Home = lazy(() => {
  return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    resolve(import('./components/home/Home'));
  });
});

function App() {
  // url parameter
  const queryParameters = new URLSearchParams(window.location.search)
  const widget = queryParameters.get("w")

  useEffect(() => {
    if (window.location.pathname === "/") {
      if (widget !== "1" && widget !== "2" && widget !== "3" && widget !== "4") {
        window.location.href = "/?w=1";
      }
    }
  }, [widget]);

  return (
    <Router>
      <Suspense fallback={<MainLoading />}>
        <Routes>
          {/* link setup */}
          <Route path="/?w=1" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;