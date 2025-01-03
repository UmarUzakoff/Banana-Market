import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { toast } from "react-toastify";
import axios from "axios";
import { Edit2, Trash } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  color: string;
  price: string;
  quantity: number;
  category: Category;
  image: string;
}

interface FormInputs {
  name: string;
  color: string;
  price: string;
  quantity: number;
  category: string;
  image: FileList;
}

const ProductsDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<FormInputs>();

  const fetchProducts = async () => {
    try {
      const token = useAuthStore.getState().token;

      if (!token) {
        toast.error("You must be logged in to fetch products.");
        return;
      }

      const response = await axios.get("http://localhost:3333/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get("http://localhost:3333/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("color", data.color);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity.toString());
    formData.append("category", data.category);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        toast.error("You must be logged in to submit a product.");
        return;
      }

      console.log(editId);

      if (isEditing && editId) {
        await axios.put(`http://localhost:3333/products/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Product updated successfully!");
      } else {
        await axios.post("http://localhost:3333/products", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Product created successfully!");
      }
      reset();
      setIsEditing(false);
      setEditId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to submit product.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        toast.error("You must be logged in to delete a product.");
        return;
      }

      await axios.delete(`http://localhost:3333/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  const handleEdit = (product: Product) => {
    setValue("name", product.name);
    setValue("color", product.color);
    setValue("price", product.price);
    setValue("quantity", product.quantity);
    setValue("category", product.category._id);
    setIsEditing(true);
    setEditId(product._id);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 mb-8">
        <Input {...register("name", { required: true })} placeholder="Name" />
        <Input {...register("color", { required: true })} placeholder="Color" />
        <Input {...register("price", { required: true })} placeholder="Price" />
        <Input
          {...register("quantity", { required: true })}
          placeholder="Quantity"
          type="number"
        />
        <select
          {...register("category", { required: true })}
          className="border rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <Input {...register("image")} type="file" />
        <Button type="submit" className="mt-4 text-banana">
          {isEditing ? "Update" : "Create"}
        </Button>
      </form>
      <Table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4 text-left text-banana">Name</th>
            <th className="p-4 text-left text-banana">Color</th>
            <th className="p-4 text-left text-banana">Price</th>
            <th className="p-4 text-left text-banana">Quantity</th>
            <th className="p-4 text-left text-banana">Category</th>
            <th className="p-4 text-left text-banana">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b hover:bg-gray-100 transition-all duration-300">
              <td className="p-4">{product.name}</td>
              <td className="p-4">{product.color}</td>
              <td className="p-4">{product.price}</td>
              <td className="p-4">{product.quantity}</td>
              <td className="p-4">{product.category.name}</td>
              <td className="p-4 flex gap-2">
                <Button
                  onClick={() => handleEdit(product)}
                  className="flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600">
                  <Edit2 size={20} />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product._id)}
                  className="flex items-center justify-center bg-red-500 text-white hover:bg-red-600">
                  <Trash size={20} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductsDashboard;
