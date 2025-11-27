import { useState, useEffect } from "react";
import { Search } from "lucide-react";

function OrderProduct() {
  const [products, setProducts] = useState([]); // product list from Django
  const [orderItems, setOrderItems] = useState([]); // selected items for order
  const [showForm, setShowForm] = useState(false);


  const submitPaidOrder = () => {
  const formatDate = (date) => {
      if (!date) return null;
      return new Date(date).toISOString().split("T")[0];
    };

    const orderPayload = {
      status: "Paid",
      cus_name: customerData.name || null,
      contact_num: customerData.phone || null,
      due_date: formatDate(customerData.dueDate),
      total_amt: orderItems.reduce((sum, item) => {
        const price = Number(item.price.replace("₱", ""));
        return sum + price * item.qty;
      }, 0),

      items: orderItems.map((item) => ({
        product_name: item.name,
        qty: item.qty,
        price: Number(item.price.replace("₱", "")),
        subtotal: Number(item.price.replace("₱", "")) * item.qty,
      })),
    };

    // 1. CREATE ORDER
    fetch("http://127.0.0.1:8000/api/create-order/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    })
      .then((res) => res.json())
      .then((orderData) => {
        console.log("ORDER CREATED:", orderData);

        // -- IMPORTANT FIX --
        const orderId =
          orderData.order_id || orderData.id || orderData.order || null;

        console.log("USING ORDER ID:", orderId);

        if (!orderId) {
          console.error("❌ ERROR: No order ID returned from backend");
          return;
        }

        // 2. CREATE TRANSACTION
        fetch("http://127.0.0.1:8000/api/transactions/create/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: orderId,
            status: "Paid",
            cus_name: orderData.cus_name,
            contact_num: orderData.contact_num,
            total_amt: orderData.total_amt,
            due_date: orderData.due_date,
          }),
        })
          .then((res) => res.json())
          .then((tdata) => {
            console.log("TRANSACTION CREATED:", tdata);
          });

        alert("Order marked as PAID!");
        setOrderItems([]);
        setCustomerData({ name: "", phone: "", dueDate: "" });
      })
      .catch((err) => console.error("PAID ORDER ERROR:", err));
  };




  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
  });
    const submitOrder = () => {
      const orderPayload = {
        status: "Pending",
        cus_name: customerData.name,
        contact_num: customerData.phone,
        due_date: customerData.dueDate,  // <-- FIXED (MUST SEND THIS)
        total_amt: orderItems.reduce((sum, item) => {
          const price = Number(item.price.replace("₱", ""));
          return sum + price * item.qty;
        }, 0),
        items: orderItems.map((item) => ({
          product_name: item.name,
          qty: item.qty,
          price: Number(item.price.replace("₱", "")),
          subtotal: Number(item.price.replace("₱", "")) * item.qty,
        })),
      };

      console.log("Sending:", orderPayload); // CHECK THIS IN CONSOLE

      fetch("http://127.0.0.1:8000/api/create-order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Order saved!");
          console.log("ORDER RESPONSE:", data);

          setOrderItems([]);
          setCustomerData({ name: "", phone: "", dueDate: "" });
        })
        .catch((err) => console.error("ORDER ERROR:", err));
    };


  // Fetch products from Django API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(
          data.map((item) => ({
            ...item,
            selling_price: `₱${item.selling_price}`, // Ensure price format
            checked: false,
          }))
        );
      })
      .catch((err) => console.log("ERROR:", err));
  }, []);

  // Toggle checkbox
  const handleCheckboxChange = (index) => {
    const updated = [...products];
    updated[index].checked = !updated[index].checked;
    setProducts(updated);
  };

  // Add selected products to Order Details
  const handleAddSelectedToOrder = () => {
    const selected = products.filter((p) => p.checked);

    if (selected.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    const newOrders = selected.filter(
      (p) => !orderItems.some((item) => item.name === p.name)
    );

    const withQty = newOrders.map((p) => ({ ...p, qty: 1 }));

    setOrderItems([...orderItems, ...withQty]);

    const resetChecked = products.map((p) => ({ ...p, checked: false }));
    setProducts(resetChecked);
  };

  // Update quantity
  const updateQty = (index, type) => {
    const updated = [...orderItems];
    if (type === "inc") updated[index].qty += 1;
    if (type === "dec" && updated[index].qty > 1) updated[index].qty -= 1;
    setOrderItems(updated);
  };

  const [showModal, setShowModal] = useState(false);

  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    dueDate: "",
  });

  return (
    <div className="p-6 space-y-8">
      {/* PRODUCT LIST */}
      <div className="bg-white p-6 rounded-xl border border-[#D9D9D9] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-[#4D1C0A]">Product List</h1>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-md">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400 w-40"
            />
          </div>
        </div>

        <table className="w-full text-sm text-[#4D1C0A] border-t border-b">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-2 px-3 text-center text-gray-500 font-semibold">
                Select
              </th>
              <th className="py-2 px-3 text-center text-gray-500 font-semibold">
                Product
              </th>
              <th className="py-2 px-3 text-center text-gray-500 font-semibold">
                Category
              </th>
              <th className="py-2 px-3 text-center text-gray-500 font-semibold">
                Selling Price
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={p.checked}
                    onChange={() => handleCheckboxChange(index)}
                    className="w-4 h-4 rounded"
                  />
                </td>
                <td className="py-2 px-3 text-center">{p.name}</td>
                <td className="py-2 px-3 text-center">{p.category}</td>
                <td className="py-2 px-3 text-center">{p.selling_price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddSelectedToOrder}
            className="bg-[#F28C28] hover:bg-[#e07a1e] text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ORDER DETAILS */}
      <div className="w-full bg-white/50 backdrop-blur-sm p-6 rounded-[10px] border border-[#A29E9E]/80 shadow-sm">
        <h1 className="text-[22px] font-bold text-[#4D1C0A] mb-4">
          Order Details
        </h1>

        <div className="border border-[#A29E9E]/60 rounded-[10px] overflow-hidden bg-white/70">
          <div className="grid grid-cols-3 bg-[#F7F7F7] border-b border-[#A29E9E]/50 py-2 px-4 text-sm font-semibold text-[#4D1C0A]">
            <div>Products</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Subtotal</div>
          </div>

          {orderItems.map((p, index) => {
            const priceNum = Number(p.price.replace("₱", ""));
            const subtotal = priceNum * p.qty;

            return (
              <div
                key={index}
                className="grid grid-cols-3 items-center border-b border-[#A29E9E]/40 py-3 px-4 text-[#4D1C0A]"
              >
                {/* LEFT SIDE: REMOVE BUTTON + PRODUCT NAME */}
                <div className="flex items-center gap-3 text-[15px]">
                  <button
                    onClick={() => {
                      const updated = orderItems.filter((_, i) => i !== index);
                      setOrderItems(updated);
                    }}
                    className="w-7 h-7 flex justify-center items-center border border-red-400 text-red-500 rounded hover:bg-red-50"
                  >
                    ×
                  </button>

                  <span>{p.name}</span>
                </div>

                {/* QUANTITY */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(index, "dec")}
                      className="w-8 h-7 flex justify-center items-center border border-[#A29E9E]/60 rounded hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="w-6 text-center font-semibold">{p.qty}</span>

                    <button
                      onClick={() => updateQty(index, "inc")}
                      className="w-8 h-7 flex justify-center items-center border border-[#A29E9E]/60 rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* SUBTOTAL */}
                <div className="text-right font-medium">₱{subtotal}</div>
              </div>
            );
          })}

        </div>

        <div className="flex justify-end mt-3">
          <div className="text-lg font-bold text-[#4D1C0A]">
            Total: ₱
            {orderItems.reduce((sum, p) => {
              const priceNum = Number(p.price.replace("₱", ""));
              return sum + priceNum * p.qty;
            }, 0)}
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-4">
           <button
            onClick={() => setShowModal(true)}
            className="bg-[#EFEFEF] hover:bg-[#DCDCDC] text-black font-semibold px-5 py-2 rounded-lg shadow-sm"
          >
            Pending
          </button>

          <button
            onClick={() => {
              submitPaidOrder();
            }}
            className="bg-[#F28C28] hover:bg-[#DA7A1D] text-white font-semibold px-5 py-2 rounded-lg shadow-sm"
          >
            Paid
         </button>

        </div>
      </div>
      {/* PENDING MODAL */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
    <div className="bg-white w-[600px] rounded-xl p-8 relative shadow-xl">

      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-2xl font-bold text-[#4D1C0A] mb-6">
        Customer Details
      </h2>

      {/* FORM */}
      <div className="space-y-5">

        {/* Name */}
        <div>
          <label className="block text-[#4D1C0A] font-semibold mb-1">
            Customer Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={customerData.name}
            onChange={(e) =>
              setCustomerData({ ...customerData, name: e.target.value })
            }
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[#4D1C0A] font-semibold mb-1">
            Phone Number
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={customerData.phone}
            onChange={(e) =>
              setCustomerData({ ...customerData, phone: e.target.value })
            }
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-[#4D1C0A] font-semibold mb-1">
            Due Date
          </label>
          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2"
            value={customerData.dueDate}
            onChange={(e) =>
              setCustomerData({ ...customerData, dueDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-center mt-8">
        <button
        className="bg-[#F28C28] hover:bg-[#DA7A1D] text-white font-semibold px-10 py-3 rounded-lg"
        onClick={() => {
          submitOrder(); 
          setShowModal(false);
        }}
      >
        Submit
      </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default OrderProduct;
