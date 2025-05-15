import "./index.css";
import AppRouter from "./routes/AppRouter";
import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <AppRouter />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
