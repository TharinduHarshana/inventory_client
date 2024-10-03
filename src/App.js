import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Import router components
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Inventory from "../src/pages/inventorPage";
import EditItemPage from "./components/editeInventoryItem";
import AddItemPage from "./components/addItem";
import AddNewSupplier from "./components/addNewSupplier"
import SupplierPage from "./pages/supplierPage";
import EditSupplierDetails from "./components/editSupplierDetails";
import AddExpense from "./components/addExpense";
import ExpensePage from "./pages/expensePage";
import EditExpense from "./components/editExpence";
import Customer from "./pages/customerPage";
import AddCustomer from "./components/addCustomer";
import Sales from "./components/Sales";
import Order from "./components/toBeShiftOrders";
import Shiped from "./components/shiftedOrders";
import DashboardContent from "./components/dashboardContent";
import Report  from "./pages/report"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path ="/inventory/:id" element={<EditItemPage/>} />
        <Route path ="inventory/add" element={<AddItemPage/>} />
        <Route path ="/suplier/add" element={<AddNewSupplier/>} />
        <Route path="/suplier" element={<SupplierPage />} />
        <Route path="/suplier/:_id" element={<EditSupplierDetails/>} />
        <Route path ="/expense/add" element={<AddExpense/>} />
        <Route path ="/expense" element={<ExpensePage/>} />
        <Route path ="/expense/:id" element={<EditExpense/>} />
        <Route path ="/customer" element={<Customer/>} />
        <Route path ="/customer/add" element={<AddCustomer/>} />
        <Route path ="/sales" element={<Sales/>} />
        <Route path ="/shipping" element={<Order/>} />
        <Route path ="/Shiped" element={<Shiped/>} />
        <Route path="/content" element={<DashboardContent/>}></Route>
        <Route path="/report" element={<Report/>}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App; // Ensure you export the App component as default
