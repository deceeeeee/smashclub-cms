import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Courts from "../pages/Courts/Courts";
import CourtForm from "../pages/Courts/CourtForm";
import Products from "../pages/Products/Products";
import ProductForm from "../pages/Products/ProductForm";
import Trainers from "../pages/Trainers/Trainers";
import TrainerForm from "../pages/Trainers/TrainerForm";
import Equipment from "../pages/Equipment/Equipment";
import EquipmentForm from "../pages/Equipment/EquipmentForm";
import Users from "../pages/Users/Users";
import UserForm from "../pages/Users/UserForm";
import Players from "../pages/Players/Players";
import PlayerForm from "../pages/Players/PlayerForm";
import SalesReport from "../pages/SalesReport/SalesReport";
import SalesDailyReport from "../pages/SalesReport/SalesDailyReport";
import SalesDetail from "../pages/SalesReport/SalesDetail";
import CourtBookingReport from "../pages/CourtBookingReport/CourtBookingReport";
import CourtBookingDailyReport from "../pages/CourtBookingReport/CourtBookingDailyReport";
import ProductBookingReport from "../pages/ProductSalesReport/ProductSalesReport";
import ProductSalesDailyReport from "../pages/ProductSalesReport/ProductSalesDailyReport";
import Roles from "../pages/Roles/Roles";
import RoleForm from "../pages/Roles/RoleForm";
import EquipmentCategory from "../pages/EquipmentCategory/EquipmentCategory";
import EquipmentCategoryForm from "../pages/EquipmentCategory/EquipmentCategoryForm";
import ProfileForm from "../pages/Profile/ProfileForm";
import Refunds from "../pages/Refunds/Refunds";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/Error/ErrorPage";
import ProtectedRoute from "../components/ProtectedRoute";
import CourtBookingDetail from "../pages/CourtBookingReport/CourtBookingDetail";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        element: <ProtectedRoute />,
        errorElement: <ErrorPage />,
        children: [
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
                        path: "courts",
                        element: <Courts />,
                    },
                    {
                        path: "courts/add",
                        element: <CourtForm />,
                    },
                    {
                        path: "courts/edit/:id",
                        element: <CourtForm />,
                    },
                    {
                        path: "products",
                        element: <Products />,
                    },
                    {
                        path: "products/add",
                        element: <ProductForm />,
                    },
                    {
                        path: "products/edit/:id",
                        element: <ProductForm />,
                    },
                    {
                        path: "trainers",
                        element: <Trainers />,
                    },
                    {
                        path: "trainers/add",
                        element: <TrainerForm />,
                    },
                    {
                        path: "trainers/edit/:id",
                        element: <TrainerForm />,
                    },
                    {
                        path: "equipment",
                        element: <Equipment />,
                    },
                    {
                        path: "equipment/add",
                        element: <EquipmentForm />,
                    },
                    {
                        path: "equipment/edit/:id",
                        element: <EquipmentForm />,
                    },
                    {
                        path: "equipment-categories",
                        element: <EquipmentCategory />,
                    },
                    {
                        path: "equipment-categories/add",
                        element: <EquipmentCategoryForm />,
                    },
                    {
                        path: "equipment-categories/edit/:id",
                        element: <EquipmentCategoryForm />,
                    },
                    {
                        path: "users",
                        element: <Users />,
                    },
                    {
                        path: "users/add",
                        element: <UserForm />,
                    },
                    {
                        path: "users/edit/:id",
                        element: <UserForm />,
                    },
                    {
                        path: "players",
                        element: <Players />,
                    },
                    {
                        path: "players/add",
                        element: <PlayerForm />,
                    },
                    {
                        path: "players/edit/:id",
                        element: <PlayerForm />,
                    },
                    {
                        path: "reports/sales",
                        element: <SalesReport />,
                    },
                    {
                        path: "reports/sales/:month",
                        element: <SalesDailyReport />,
                    },
                    {
                        path: "reports/sales/detail/:id",
                        element: <SalesDetail />,
                    },
                    {
                        path: "roles",
                        element: <Roles />,
                    },
                    {
                        path: "roles/add",
                        element: <RoleForm />,
                    },
                    {
                        path: "roles/edit/:id",
                        element: <RoleForm />,
                    },
                    {
                        path: "profile",
                        element: <ProfileForm />,
                    },
                    // Placeholder routes for navigation items not yet implemented
                    {
                        path: "reports/bookings",
                        element: <CourtBookingReport />,
                    },
                    {
                        path: "reports/bookings/:month",
                        element: <CourtBookingDailyReport />,
                    },
                    {
                        path: "reports/bookings/detail/:id",
                        element: <CourtBookingDetail />,
                    },
                    {
                        path: "reports/products",
                        element: <ProductBookingReport />,
                    },
                    {
                        path: "reports/products/:month",
                        element: <ProductSalesDailyReport />,
                    },
                    {
                        path: "refund-request",
                        element: <Refunds />,
                    },
                ],
            },
        ],
    },
]);
