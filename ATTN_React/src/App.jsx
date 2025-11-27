import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TransactionList from "./pages/transaction-list";
import PrivateRoute from "./utility/PrivateRoute";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import OrderProduct from "./pages/transaction_order_product";
import AddProduct from "./pages/inventory_add_product";
import Ewallet from "./pages/transaction_ewallet";
import ProductList from "./pages/inventory_product_list";
import EditProduct from "./pages/inventory_edit_product";
import "./App.css";


function Layout({ children, isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const titles = {
      "/dashboard": "Dashboard",
      "/transaction-list": "Transaction",
    };
    setPageTitle(titles[location.pathname] || "ATTN Store");
    document.title = titles[location.pathname] || "ATTN Store";
  }, [location]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Topbar + Content */}
      <main className="flex-1 transition-all duration-300 lg:ml-72">
        <div className="sticky top-0 bg-white shadow-sm">
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} pageTitle={pageTitle} />
        </div>

        {/* Page Content */}
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // shared sidebar state
  const [message, setMessage] = useState("Loading...");

useEffect(() => {
    fetch("http://127.0.0.1:8000/ATTN_Backend/web_desc/")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setMessage(JSON.stringify(data.recipes, null, 2)))
      .catch(() => setMessage("Failed to load recipes."));
  }, []);
    
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected route with Sidebar and. Topbar */}
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <Dashboard />
      </Layout>
    </PrivateRoute>
  }
/>
<Route
  path="/transaction_order_product"
  element={
    <PrivateRoute>
      <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <OrderProduct />
      </Layout>
    </PrivateRoute>
  }
/>
<Route
  path="/transaction-list"
  element={
    <PrivateRoute>
      <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <TransactionList />
      </Layout>
    </PrivateRoute>
  }
/>
<Route
  path="/transaction_ewallet"
  element={
    <PrivateRoute>
      <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <Ewallet />
      </Layout>
    </PrivateRoute>
  }
/>
<Route
  path="/inventory_add_product"
  element={
    <PrivateRoute>
      <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <AddProduct />
      </Layout>
    </PrivateRoute>
  }
/>

<Route
  path="/inventory_product_list"
  element={
    <PrivateRoute>
      <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <ProductList />
      </Layout>
    </PrivateRoute>
  }
/>

<Route
  path="/inventory_edit_product/:id"
  element={
    <PrivateRoute>
      <Layout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
        <EditProduct />
      </Layout>
    </PrivateRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
