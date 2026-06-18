import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import MenPage from "./pages/MenPage";
import WomenPage from "./pages/WomenPage";
import ShopPage from "./pages/ShopPage";
import CartDrawer from "./components/CartDrawer";

export default function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <BrowserRouter>
      <CartDrawer />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/shop" element={token ? <ShopPage /> : <Navigate to="/login" replace />} />
        <Route path="/men" element={token ? <MenPage /> : <Navigate to="/login" replace />} />
        <Route path="/women" element={token ? <WomenPage /> : <Navigate to="/login" replace />} />
        <Route path="/product/:id" element={token ? <ProductDetail /> : <Navigate to="/login" replace />} />
        <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
