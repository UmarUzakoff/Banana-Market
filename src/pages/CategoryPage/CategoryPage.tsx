import { useParams } from "react-router-dom";
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
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

const fetchProductsByCategory = async (categoryId: string) => {
  const { data } = await axios.get(
    `https://productscategoriesexpress-production.up.railway.app/products?category=${categoryId}`
  );
  return data.products;
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => fetchProductsByCategory(categoryId!),
  });

  const { isAuthenticated } = useAuthStore((state) => state);

  const { likedProducts, addLikedProduct, removeLikedProduct } =
    useLikedProductsStore();

  const handleLike = (product: any) => {
    if (!isAuthenticated) {
      toast.error("You need to log in to like products!");
      return;
    }

    if (likedProducts.some((p) => p._id === product._id)) {
      removeLikedProduct(product._id);
    } else {
      addLikedProduct(product);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Products in Category
      </h1>

      {isLoading && <p>Loading products...</p>}
      {isError && <p>Error fetching products. Please try again later.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
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
                src={`https://productscategoriesexpress-production.up.railway.app/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-xl font-bold text-banana mt-4">
                {product.price} so'm
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
        ))}
      </div>
    </main>
  );
};

export default CategoryPage;
