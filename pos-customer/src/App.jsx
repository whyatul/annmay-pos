import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Route>
    </Routes>
  );
}

export default App;
