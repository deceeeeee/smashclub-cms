import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Fields from "../pages/Fields/Fields";
import FieldForm from "../pages/Fields/FieldForm";
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
import SalesReport from "../pages/Reports/SalesReport";
import FieldBookingReport from "../pages/Reports/FieldBookingReport";
import ProductBookingReport from "../pages/Reports/ProductBookingReport";
import Roles from "../pages/Roles/Roles";
import RoleForm from "../pages/Roles/RoleForm";
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
                path: "fields/add",
                element: <FieldForm />,
            },
            {
                path: "fields/edit/:id",
                element: <FieldForm />,
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
            // Placeholder routes for navigation items not yet implemented
            {
                path: "reports/bookings",
                element: <FieldBookingReport />,
            },
            {
                path: "reports/products",
                element: <ProductBookingReport />,
            },
        ],
    },
]);
