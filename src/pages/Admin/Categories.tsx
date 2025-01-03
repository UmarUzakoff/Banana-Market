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
  description: string;
  image: string;
}

interface FormInputs {
  name: string;
  description: string;
  image: FileList;
}

const CategoriesDashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<FormInputs>();

  const fetchCategories = async () => {
    try {
      const token = useAuthStore.getState().token;

      if (!token) {
        toast.error("You must be logged in to fetch categories.");
        return;
      }

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
    formData.append("description", data.description);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        toast.error("You must be logged in to submit a category.");
        return;
      }

      if (isEditing && editId) {
        await axios.put(
          `http://localhost:3333/categories/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category updated successfully!");
      } else {
        await axios.post("http://localhost:3333/categories", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Category created successfully!");
      }
      reset();
      setIsEditing(false);
      setEditId(null);
      fetchCategories();
    } catch (error: any) {
      toast.error("Failed to submit category.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        toast.error("You must be logged in to delete a category.");
        return;
      }

      await axios.delete(`http://localhost:3333/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category.");
    }
  };

  const handleEdit = (category: Category) => {
    setValue("name", category.name);
    setValue("description", category.description);
    setIsEditing(true);
    setEditId(category._id);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 mb-8">
        <Input {...register("name", { required: true })} placeholder="Name" />
        <Input
          {...register("description", { required: true })}
          placeholder="Description"
        />
        <Input {...register("image")} type="file" />
        <Button type="submit" className="mt-4 text-banana">
          {isEditing ? "Update Category" : "Create Category"}
        </Button>
      </form>

      <Table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4 text-left text-banana">Name</th>
            <th className="p-4 text-left text-banana">Description</th>
            <th className="p-4 text-left text-banana">Image</th>
            <th className="p-4 text-left text-banana">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category._id}
              className="border-b hover:bg-gray-100 transition-all duration-300">
              <td className="p-4">{category.name}</td>
              <td className="p-4">{category.description}</td>
              <td className="p-4">
                <img
                  src={`http://localhost:3333/uploads/${category.image}`}
                  alt={category.name}
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="p-4 flex gap-2">
                <Button
                  onClick={() => handleEdit(category)}
                  className="flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600">
                  <Edit2 size={20} />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(category._id)}
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

export default CategoriesDashboard;
