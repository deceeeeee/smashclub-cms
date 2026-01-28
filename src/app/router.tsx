import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Fields from "../pages/Fields/Fields";
import Products from "../pages/Products/Products";
import Trainers from "../pages/Trainers/Trainers";
import Equipment from "../pages/Equipment/Equipment";
import Users from "../pages/Users/Users";
import SalesReport from "../pages/Reports/SalesReport";
import MainLayout from "../layouts/MainLayout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "fields",
                element: <Fields />,
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "trainers",
                element: <Trainers />,
            },
            {
                path: "equipment",
                element: <Equipment />,
            },
            {
                path: "users",
                element: <Users />,
            },
            {
                path: "reports/sales",
                element: <SalesReport />,
            },
            // Placeholder routes for navigation items not yet implemented
            { path: "players", element: <div className="p-8 text-white">Data Pemain Under Construction</div> },
            { path: "reports/bookings", element: <div className="p-8 text-white">Laporan Pemesanan Lapangan Under Construction</div> },
            { path: "reports/products", element: <div className="p-8 text-white">Laporan Pemesanan Produk Under Construction</div> },
        ],
    },
]);
