// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar";
// import Topbar from "./components/Topbar";
// import PrivateRoute from "./utility/PrivateRoute";
// import Login from "./pages/login";
// import Dashboard from "./pages/dashboard";
// import "./App.css";

// function InventoryAddProd() {
//     const [product, setProduct] = useState({
//         name: "",
//         price: "",
//         stock: ""
//     });
// }

function AddProduct() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#4D1C0A] mb-4">Product List</h1>
      <p>This is your ADD Product List page.</p>
    </div>
  );
}

export default AddProduct;