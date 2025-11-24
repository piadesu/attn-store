import { use, useEffect, useState } from "react";
import { data, useNavigate } from 'react-router-dom';


// change data from database later
function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCaategory, setFilterCategory] = useState("");

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

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold text-[#4D1C0A] mb-4">Products</h1>
      <div className="border rounded-xl p-6 shadow-sm bg-white">
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
          <div className="relative w-full max-w-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
              fill="gray"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6
              457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 
              401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 
              416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>

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
          className="relative border font-semibold text-[#4D1C0A] border-gray-300 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition ml-4"
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
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
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
                <td className="p-3 text-gray-500">₱{prod.price}</td>
                <td className="p-3 text-gray-500">
                  {prod.stock_status ? "In-stock" : "Out of Stock"}
                </td>
                <td className="p-3 flex gap-2">
                  <button className="border px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-100 transition">View</button>
                  <button className="border px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-100 transition">Delete</button>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>




      </div>
    </div>

  )
}

export default ProductList;