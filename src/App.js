import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signin from "./components/signin/Signin";
import Signup from "./components/signup/Signup";
import Home from "./components/home/Home";
import Cart from "./components/cart/Cart";
import Profile from "./components/profile/Profile";
import AdminSignin from "./components/signin/Admin_Signin";
import Dashboard from "./components/dashboard/Dashboard";
import Order from "./components/order/Order";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home will be protected later */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin_signin" element={<AdminSignin />} />
        <Route path="/admin_dashboard" element={<Dashboard />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </Router>
  );
}

export default App;
