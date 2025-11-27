import { use, useEffect, useState } from "react";
import { data, useNavigate } from 'react-router-dom';
import {Search} from "lucide-react";


//function modal to view the info of each product 
function ViewProductModal({ isOpen, onClose, product, onEdit }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-lg relative">

        {/* close button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold">
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#4D1C0A] border-b pb-2">Product Details</h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Product Image</p>
          </div>
          <div>
            {product.image && (
              <img
                src={`http://127.0.0.1:8000${product.image}`}
                className="w-30 h-24 rounded-lg object-cover"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Name of Product</p>
              <div className="border border-gray-300 pl-2 p-1 mt-2 rounded-lg bg-gray-100">
                <p className="text-md font-semibold text-gray-600">{product.name}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Category</p>
              <div className="border border-gray-300 pl-2 p-1 mt-2 mt-2 rounded-lg bg-gray-100">
                <p className="text-md font-semibold text-gray-600">{product.category}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Cost Price</p>
              <div className="border border-gray-300 pl-2 p-1 mt-2 rounded-lg bg-gray-100">
                <p className="text-md font-semibold text-gray-600">₱ {product.cost_price}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Selling Price</p>
              <div className="border border-gray-300 pl-2 p-1 mt-2 rounded-lg bg-gray-100">
                <p className="text-md font-semibold text-gray-600">₱ {product.selling_price}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Stock Status</p>
              <div className="border border-gray-300 pl-2 p-1 mt-2 rounded-lg bg-gray-100">
                <p className="text-md font-semibold text-gray-600">{product.stock_status ? "In-stock" : "Out of Stock"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Stock Quantity</p>
              <div className="border border-gray-300 pl-2 p-1 mt-2 rounded-lg bg-gray-100">
                <p className="text-md font-semibold text-gray-600">{product.stock}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => navigate(`/inventory_edit_product/${product.id}`)} className="bg-[#F8961E] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#e78c1c] transition">Edit</button>
        </div>

      </div>
    </div>
  );
}



function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCaategory, setFilterCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products: ", err));
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCaategory === "" || item.category === filterCaategory;

    return matchesSearch && matchesCategory;
  });


  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({ is_active: false }),
      });

      if (!res.ok) throw new Error("Failed to delete product");
      
      // Show success notification
      setNotification({ show: true, message: "Product deleted successfully!", type: "success" });
      
      // Remove product from list
      setProducts(products.filter(p => p.id !== id));
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
    } catch (error) {
      console.error("Error deleting product: ", error);
      setNotification({ show: true, message: "Failed to delete product", type: "error" });
      setTimeout(() => setNotification({ show: false, message: "", type: "error" }), 3000);
    }
  };


  return (
    <div className="p-3">
      {/* Toast Notification */}
      {notification.show && (
        <div className="toast toast-top toast-end">
          <div className={`alert ${notification.type === "success" ? "alert-success" : "alert-error"}`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-[#4D1C0A] mb-4">Products</h1>
      <div className="border rounded-xl p-6 shadow-sm bg-white ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold pb-2 text-[#4D1C0A]">Product List</h2>
          <button
            className="bg-[#F8961E] text-md font-bold text-white px-4 py-2 
          rounded-lg hover:bg-[#f7a136] transition"
            onClick={() => navigate("/inventory_add_product")}>+ Add Product</button>
        </div>
        <div className="border border-b-1 border-[#4D1C0A]"></div>

        {/* search filter */}
        <div className="flex items-center justify-between mb-4 mt-4 w-full">

          {/* Search Section */}
          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg w-full p-2 pl-10 border-gray-300 text-gray-800
              focus:outline-none
              focus:ring-2 focus:ring-[#F8961E]/50
              focus:border-[#F8961E]
              transition-all"
            />
          </div>

          {/* Filter Button */}
          <select
            className="border font-semibold text-[#4D1C0A] border-gray-300 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition ml-4"
            value={filterCaategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>

            {/* Filter Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5"
              fill="#4D170A"
            >
              <path d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 
              109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 
              64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 
              182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z"/>
            </svg>
          </select>

        </div>



        {/* table */}
        <table className="w-full border-collpase">
          <thead>
            <tr className="border-b border-t border-gray-400 text-left text-gray-500">
              <th className="p-3">Products</th>
              <th className="p-3">Category</th>
              <th className="p-3">Cost Price</th>
              <th className="p-3">Selling Price</th>
              <th className="p-3">Stock Status</th>
              <th className="p-3 pl-10">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => (
                <tr key={prod.id} className="border-b">
                  <td className="p-3 text-gray-700 font-medium">{prod.name}</td>
                  <td className="p-3 text-gray-500">{prod.category}</td>
                  <td className="p-3 text-gray-500">₱ {prod.cost_price}</td>
                  <td className="p-3 text-gray-500">₱ {prod.selling_price}</td>
                  <td className="p-3 text-gray-500">
                    {prod.stock_status ? "In-stock" : "Out of Stock"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleViewProduct(prod)} className="border px-3 py-1 border border-[#4D170A] rounded-lg text-[#4D170A] hover:bg-[#4D170A] hover:text-white transition">View</button>
                    <button onClick={() => {
                      setDeleteId(prod.id);
                      setShowDeleteModal(true);
                    }
                    } className="border px-3 py-1 bg-[#EA6464] rounded-lg text-white hover:bg-[#f57676] transition">Delete</button>
                  </td>
                </tr>

              ))
            )}
          </tbody>
        </table>

        {showModal && selectedProduct && (
          <ViewProductModal
            isOpen={showModal}
            product={selectedProduct}
            onClose={() => setShowModal(false)}
          />
        )}



      </div>
    </div>

  )
}

export default ProductList;