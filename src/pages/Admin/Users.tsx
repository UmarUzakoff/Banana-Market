import React, { useEffect, useState } from "react";
import { Table } from "@/components/ui/table";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const token = useAuthStore.getState().token;

      if (!token) {
        toast.error("You must be logged in to access users.");
        return;
      }

      const response = await axios.get("http://localhost:3333/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Users Dashboard</h2>

      <Table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4 text-left text-banana">Name</th>
            <th className="p-4 text-left text-banana">Email</th>
            <th className="p-4 text-left text-banana">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-100 transition-all duration-300">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize">{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersDashboard;
