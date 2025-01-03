import { Outlet } from "react-router-dom";
import DashboardLayout from "./Layout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold">Welcome to the Dashboard!</h1>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;
