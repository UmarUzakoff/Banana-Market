import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Tag, Users } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/", icon: <Home /> },
    { name: "Products", path: "/dashboard/products", icon: <Tag /> },
    { name: "Categories", path: "/dashboard/categories", icon: <Tag /> },
    { name: "Users", path: "/dashboard/users", icon: <Users /> },
  ];

  return (
    <aside className="w-64 bg-neutral-950 text-banana fixed top-0 left-0 h-full p-4 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-md transition ${
                  location.pathname === item.path
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen ml-64">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
