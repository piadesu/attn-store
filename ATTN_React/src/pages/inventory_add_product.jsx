import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar";
// import Topbar from "./components/Topbar";
// import PrivateRoute from "./utility/PrivateRoute";
// import Dashboard from "./pages/dashboard";
// import "./App.css";

import { use } from "react";

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    //basic validation for image file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(selectedFile.type)) {
      alert("Only SVG, PNG, JPG, JPEG, GIF image file types are allowed.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files[0];
    handleFile(droppedFiles);

  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);

  };

  return (

    <div className="border rounded-xl p-6 shadow-sm bg-white">
      <h2 className="font-bold mb-2 border-b-1 border-[#4D1C0A]-400 pb-2 text-[#4D1C0A]">Product Image</h2>

      <div className={`border-3 border-gray-300 border-dashed mt-4 p-20 rounded-lg
       flex flex-col items-center justify-center text-center text-gray-400 transition-colors
        ${dragActive ? "border-[#F8961E] bg-orange-50" : "border-gray-300"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}>
        {preview ? (
          <img src={preview} alt="Preview" className="h-40 object-contain mb-2" />
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5.002 5.002 0 0115.9 6H16a5 5 0 010 10h-1m-2 4v-8m0 0l-3 3m3-3l3 3" />
            </svg>

            <p className="font-semibold text-gray-500">Click to upload or drag and drop <br /><span className="text-sm text-gray-400">SVG, PNG, JPG, or GIF (MAX. 800×400px)</span></p>
          </>
        )}

        <input type="file" accept=".jpg, .jpeg, .png, .gif, .svg" onChange={handleChange} className="hidden" id="fileUpload" />
        <label htmlFor="fileUpload" className="mt-3 cursor-pointer px-4 py-2 bg-transparent border border-[#4D1C0A]-400 font-semibold text-[#4D1C0A] rounded-lg hover:bg-[#4D1C0A] hover:text-white ">{preview ? "Change Image" : "Upload File"}</label>

      </div>
    </div>
  );
}


function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    stock:1,
    price: "",
    stock_status: true,
    description: ""
  });


  //handles field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  //handles quantity 
  const handleQuantityChange = (delta) => {
    setProduct((prev) => ({
      ...prev,
      stock: Math.max(1, prev.stock + delta),
    }));
  };

  //handles form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Product added:", product);


    try {
      const res = await fetch("http://127.0.0.1:8000/api/add-product/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Failed to add product");
      const data = await res.json();
      alert("Product added successfully!");
      setProduct({
        name: "",
        category: "",
        stock: 1,
        price: "",
        stock_status: true,
        description: ""
      });
      console.log("Response data:", data);
    } catch (err) {
      console.error("Error data: ", err);
      alert("Error adding product.");
    }
  };

  return (
    <div>
      {/*first section */}
      <form onSubmit={handleSubmit} >
      <div className="p-3">
        <h1 className="text-2xl font-bold text-[#4D1C0A] mb-4">Add Product</h1>
        
          <div className="border rounded-xl p-6 shadow-sm bg-white">
          <h2 className="font-bold mb-2 border-b-1 border-[#4D1C0A]-400 pb-2 text-[#4D1C0A]">
            Product Description
          </h2>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input type="text" name="name" value={product.name} onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1
              border-gray-300 text-gray-800
              focus:outline-none
              focus:ring-2 focus:ring-[#F8961E]/50
              focus:border-[#F8961E]
              transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" value={product.category} onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1 
            border-gray-300 text-gray-800
            focus:outline-none
            focus:ring-2 focus:ring-[#F8961E]/50
            focus:border-[#F8961E]
            transition-all
            cursor-pointer">
                <option value="">Select category</option>
                {/* --to be changed with category from DATABASE */}
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
              </select>

              <div className="absolute top-9 right-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <div className="flex items-center border 
            rounded-lg mt-1 border-gray-300 p-1">
                <button type="button" onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 border border-t-0 border-l-0 border-b-0 text-gray-300">-</button>
                <input type="text" name="stock" value={product.stock} readOnly
                  className="w-full text-center border-none text-gray-400" />
                <button type="button" onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 border border-t-0 border-r-0 border-b-0 text-gray-300">+</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Availability Status</label>
              <select name="stock_status" value={product.status} onChange={handleChange}
                className="w-full border border-gray-300 
            rounded-lg p-2 mt-1 text-gray-700
            focus:outline-none
            focus:ring-2 focus:ring-[#F8961E]/50
            focus:border-[#F8961E]
            transition-all
            cursor-pointer">

                <option value="">Select Status</option>
                <option value={true}>In stock</option>
                <option value={false}>Out of stock</option>
              </select>
              <div className="absolute top-9 right-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="text" name="price" value={product.price} onChange={handleChange} placeholder="Php 0.00"
                className="w-full border border-gray-300 
            rounded-lg p-2 mt-1 text-gray-800
            bg-white
            focus:outline-none
            focus:ring-2 focus:ring-[#F8961E]/50
            focus:border-[#F8961E]
            transition-all
            appearance-none
            cursor-pointer" />
            </div>
          </div>
          </div>

        
      </div>

      {/* second section */}
      {/* <div className="p-3">
      <form onSubmit={{handleSubmit}}
      className="border rounded-xl p-6 shadow-sm bg-white">
        <h2 className="font-bold mb-2 border-b-1 border-[#4D1C0A]-400 pb-2 text-[#4D1C0A]">Product Images</h2>
        <div className="border border-3 border-gray-300 border-dashed mt-4 p-30 rounded-lg">
          <h2 className="text-blue-300">upload images</h2>
        </div>
      </form>


    </div> */}

      <div className="p-3">

        <ImageUpload />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="mt-6 bg-[#F8961E] font-bold text-white px-6 py-2 rounded-lg hover:bg-[#f7a136]">Add Product</button>
      </div>
      </form>


    </div>


  );


}



export default AddProduct;