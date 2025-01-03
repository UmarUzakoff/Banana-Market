import { useLikedProductsStore } from "@/store/useLikedProducts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LikedProducts = () => {
  const { likedProducts, removeLikedProduct } = useLikedProductsStore();

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Liked Products</h1>
      {likedProducts.length === 0 ? (
        <p className="text-center">No products liked yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedProducts.map((product) => (
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
                <p className="text-sm text-gray-500">Color: {product.color}</p>
                <p className="text-sm text-gray-500">
                  Available: {product.quantity}
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => removeLikedProduct(product._id)}>
                  Unlike
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default LikedProducts;
