import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLikedProductsStore } from "@/store/useLikedProducts";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

const fetchProducts = async (page: number, limit: number) => {
  const { data } = await axios.get(
    `http://localhost:3333/products?page=${page}&limit=${limit}`
  );
  return data;
};

const Home = () => {
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page, limit),
  });

  const { likedProducts, addLikedProduct, removeLikedProduct } =
    useLikedProductsStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleLike = (product: any) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to like a product.");
      return;
    }
    if (likedProducts.some((p) => p._id === product._id)) {
      removeLikedProduct(product._id);
    } else {
      addLikedProduct(product);
    }
  };

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>

      {isLoading && <p>Loading products...</p>}
      {isError && <p>Error fetching products. Please try again later.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(
          (product: {
            _id: string;
            name: string;
            category: { name: string };
            image: string;
            price: number;
            color: string;
            quantity: number;
          }) => (
            <Card key={product._id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {product.category.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={`http://localhost:3333/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-xl font-bold text-banana mt-4">
                  {product.price} so'm
                </p>
                <p className="text-sm text-gray-500">Color: {product.color}</p>
                <p className="text-sm text-gray-500">
                  Available: {product.quantity}
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleLike(product)}>
                  {likedProducts.some((p) => p._id === product._id)
                    ? "Unlike"
                    : "Like"}
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </Button>
        <p>
          Page {page} of {totalPages}
        </p>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
          Next
        </Button>
      </div>
    </main>
  );
};

export default Home;
