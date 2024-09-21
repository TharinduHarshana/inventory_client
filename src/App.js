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
        
      </Routes>
    </BrowserRouter>
  );
}

export default App; // Ensure you export the App component as default
