import "./index.css";
import AppRouter from "./routes/AppRouter";
import Header from "./components/Header";
import { BrowserRouter, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      <AppRouter />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
