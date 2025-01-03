import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Logo from "../components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLikedProductsStore } from "@/store/useLikedProducts";
import { Search, Heart, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get("http://localhost:3333/categories/");
  return data.categories;
};

const fetchProducts = async (searchTerm: string): Promise<Product[]> => {
  const { data } = await axios.get(
    `http://localhost:3333/products?name=${searchTerm}`
  );
  return data.products;
};

const Header = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Categories query
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Products query
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products", searchTerm],
    queryFn: () => fetchProducts(searchTerm),
    enabled: searchTerm.length > 0, // Only fetch when there's a search term
  });

  const { likedProducts, clearLikedProducts } = useLikedProductsStore();
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearLikedProducts();
    navigate("/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="container">
      <div className="flex flex-row items-center justify-between h-24">
        <Logo />
        <div className="flex w-full max-w-sm items-center -space-x-2 relative">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border-banana border-r-0"
          />
          <Button type="submit">
            <Search className="text-banana" />
          </Button>

          {/* Search Results Dropdown */}
          {searchTerm.length > 0 &&
            !isLoading &&
            !isError &&
            products.length > 0 && (
              <div className="absolute z-10 top-10 left-0 w-full bg-white shadow-lg rounded-md mt-2 p-2 max-h-60 overflow-y-auto">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="flex items-center gap-2 p-2 hover:bg-banana-light rounded-md transition-colors duration-200">
                    <p className="text-gray-800 truncate">{product.name}</p>
                  </Link>
                ))}
              </div>
            )}

          {isLoading && searchTerm.length > 0 && (
            <div className="absolute z-10 left-0 w-full bg-white shadow-lg rounded-md mt-2 p-2">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-5">
          <Link
            to={"/liked"}
            className="flex justify-center items-center gap-2 flex-col">
            <Heart />
            Saralanganlar ({likedProducts.length})
          </Link>

          {isAuthenticated ? (
            <div
              onClick={handleLogout}
              className="flex justify-center items-center gap-2 flex-col">
              <LogOut />
              Chiqish
            </div>
          ) : (
            <Link
              to={"/login"}
              className="flex justify-center items-center gap-2 flex-col">
              <User />
              Kirish
            </Link>
          )}
        </div>
      </div>
      <nav className="flex gap-4 mt-4">
        {categoriesLoading && <p>Loading categories...</p>}
        {categoriesError && <p>Error fetching categories.</p>}
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            className="text-gray-800 hover:text-banana font-medium capitalize">
            {category.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
