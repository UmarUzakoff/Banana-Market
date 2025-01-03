import { Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import LikedProducts from "./pages/LikedProducts/LikedProducts";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Admin/Dashboard";
import ProductsDashboard from "./pages/Admin/Products";
import CategoriesDashboard from "./pages/Admin/Categories";
import UsersDashboard from "./pages/Admin/Users";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/liked" element={<LikedProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
            <Route index element={<h1>Welcome to Admin Dashboard</h1>} />
            <Route path="products" element={<ProductsDashboard />} />
            <Route path="categories" element={<CategoriesDashboard />} />
            <Route path="users" element={<UsersDashboard />} />
          </Route>
        </Routes>
      </Layout>
      <ToastContainer />
    </>
  );
};

export default App;
