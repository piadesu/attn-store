import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar";
// import Topbar from "./components/Topbar";
// import PrivateRoute from "./utility/PrivateRoute";
// import Dashboard from "./pages/dashboard";
// import "./App.css";

import { use } from "react";

function ImageUpload({ onFileSelect }) {
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

    onFileSelect(selectedFile);
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
    stock: 1,
    cost_price: "",
    selling_price: "",
    stock_status: true,
    is_active: true,
  });

  //for image upload
  const [image, setImage] = useState(null);

  //for notif
  const [notification, setNotification] = useState({show: false,message: "",type: "success"});

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

  //handles quantity input change
  const handleQuantityInput = (e) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value) || value < 1) value = 1;

    setProduct((prev) => ({
      ...prev,
      stock: value,
    }));
  }

  //handles form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Product added:", product);

    const formData = new FormData();

    //append product details to formData
    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value);
    });

    //append image
    if (image) {
      formData.append("image", image);
    }


    try {
      const res = await fetch("http://127.0.0.1:8000/api/add-product/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      const data = await res.json();
      setNotification({show: true, message: "Product added successfully!", type: "success"});
      setTimeout(() => 
        setNotification({show: false, message: "", type: "success"}), 3000);
        console.log("Response data:", data);

      //clear fields
      setProduct({
        name: "",
        category: "",
        stock: 1,
        cost_price: "",
        selling_price: "",
        stock_status: true,
        is_active: true,
      });
      setImage(null);


    } catch (err) {
      console.error("Error data: ", err);
      alert("Error adding product.");
    }
  };

  return (
    <div>
      {/* notif */}
      {notification.show && (
  <div className="toast toast-top toast-end z-50">
    <div 
      className={`alert ${
        notification.type === "success"
          ? "alert-success"
          : "alert-error"
      } shadow-lg`}
    >
      <div>
        <span className="font-semibold">
          {notification.message}
        </span>
      </div>
    </div>
  </div>
)}


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


              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                <div className="flex items-center border 
            rounded-lg mt-1 border-gray-300 p-1">
                  <button type="button" onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-1 border border-t-0 border-l-0 border-b-0 text-gray-300">-</button>
                  <input type="text" name="stock" value={product.stock} onChange={handleQuantityInput}
                    className="w-full text-center border-none  text-gray-400" />
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

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cost Price</label>
                <input type="text" name="cost_price" value={product.cost_price} onChange={handleChange} placeholder="₱ 0.00"
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

              <div>
                <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                <input type="text" name="selling_price" value={product.selling_price} onChange={handleChange} placeholder="₱ 0.00"
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

        <div className="p-3">
          <ImageUpload
            key={image ? "has-image" : "no-image"}
            onFileSelect={(file) => setImage(file)}
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="mt-6 bg-[#F8961E] font-bold text-white px-6 py-2 rounded-lg hover:bg-[#f7a136]">Publish Product</button>
        </div>
      </form>


    </div>


  );


}



export default AddProduct;