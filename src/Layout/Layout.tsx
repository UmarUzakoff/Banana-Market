import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideHeaderFooter = [
    "/login",
    "/register",
    "/dashboard",
    "/dashboard/products",
    "/dashboard/categories",
    "/dashboard/users",
  ].includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;
