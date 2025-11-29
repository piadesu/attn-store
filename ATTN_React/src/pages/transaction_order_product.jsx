import { useState, useEffect } from "react";
import { Search } from "lucide-react";

function OrderProduct() {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    dueDate: "",
  });
  const [showModal, setShowModal] = useState(false);

  // -----------------------------
  // TEMPORARY DUMMY PRODUCTS (30 items)
  // -----------------------------
  useEffect(() => {
    const dummyProducts = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: `Category ${(i % 5) + 1}`,
      selling_price: `₱${(100 + i * 5).toFixed(2)}`,
      checked: false,
    }));

    setProducts(dummyProducts);
  }, []);

  // -----------------------------
  // ADD ITEMS TO ORDER
  // -----------------------------
  const handleCheckboxChange = (index) => {
    const updated = [...products];
    updated[index].checked = !updated[index].checked;
    setProducts(updated);
  };

  const handleAddSelectedToOrder = () => {
    const selected = products.filter((p) => p.checked);

    if (selected.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    const newItems = selected
      .filter((p) => !orderItems.some((item) => item.name === p.name))
      .map((p) => ({ ...p, qty: 1 }));

    setOrderItems([...orderItems, ...newItems]);

    setProducts(products.map((p) => ({ ...p, checked: false })));
  };

  // -----------------------------
  // UPDATE QTY
  // -----------------------------
  const updateQty = (index, type) => {
    const updated = [...orderItems];
    if (type === "inc") updated[index].qty += 1;
    if (type === "dec" && updated[index].qty > 1) updated[index].qty -= 1;
    setOrderItems(updated);
  };

  // -----------------------------
  // FORMAT DATE FOR BACKEND
  // -----------------------------
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  };

  // -----------------------------
  // SUBMIT ORDER (PAID or PENDING)
  // -----------------------------
  const submitOrder = (statusType) => {
    const orderPayload = {
      status: statusType,
      cus_name: customerData.name || null,
      contact_num: customerData.phone || null,
      due_date: formatDate(customerData.dueDate),
      total_amt: orderItems.reduce((sum, item) => {
        const price = Number(item.selling_price.replace("₱", ""));
        return sum + price * item.qty;
      }, 0),
      items: orderItems.map((item) => ({
        product_name: item.name,
        qty: item.qty,
        price: Number(item.selling_price.replace("₱", "")),
        subtotal: Number(item.selling_price.replace("₱", "")) * item.qty,
      })),
    };

    console.log("Submitting:", orderPayload);

    alert(`Order marked as ${statusType}!`);

    // Reset UI
    setOrderItems([]);
    setCustomerData({ name: "", phone: "", dueDate: "" });
    setShowModal(false);
  };

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

              {/* Scrollable product table */}
        <div className="max-h-[300px] overflow-y-auto border rounded-lg">
          <table className="w-full text-sm text-[#4D1C0A]">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="py-2 px-3 text-center">Select</th>
                <th className="py-2 px-3 text-center">Product</th>
                <th className="py-2 px-3 text-center">Category</th>
                <th className="py-2 px-3 text-center">Selling Price</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.checked}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="py-2 px-3 text-center">{p.name}</td>
                  <td className="py-2 px-3 text-center">{p.category}</td>
                  <td className="py-2 px-3 text-center">{p.selling_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddSelectedToOrder}
            className="bg-[#F28C28] hover:bg-[#e07a1e] text-white px-4 py-2 rounded-lg shadow-sm"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ORDER DETAILS */}
      <div className="bg-white p-6 rounded-xl border border-[#A29E9E] shadow-sm">
        <h1 className="text-xl font-bold text-[#4D1C0A] mb-4">
          Order Details
        </h1>

        <div className="border rounded-lg">
          {orderItems.map((p, index) => {
            const price = Number(p.selling_price.replace("₱", ""));
            const subtotal = price * p.qty;

            return (
              <div
                key={index}
                className="grid grid-cols-3 items-center border-b px-4 py-3 text-gray-800"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setOrderItems(orderItems.filter((_, i) => i !== index))
                    }
                    className="w-7 h-7 flex justify-center items-center border border-red-400 text-red-500 rounded hover:bg-red-50"
                  >
                    ×
                  </button>
                  <span>{p.name}</span>
                </div>

                <div className="flex justify-center">
                  <button className="border px-2" onClick={() => updateQty(index, "dec")}>-</button>
                  <span className="mx-2">{p.qty}</span>
                  <button className="border px-2" onClick={() => updateQty(index, "inc")}>+</button>
                </div>

                <div className="text-right font-medium">₱{subtotal}</div>
              </div>
            );
          })}
        </div>

        <div className="text-right mt-3 font-bold text-lg text-[#4D1C0A]">
          Total: ₱
          {orderItems.reduce((sum, p) => {
            const price = Number(p.selling_price.replace("₱", ""));
            return sum + price * p.qty;
          }, 0)}
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#EFEFEF] text-black px-5 py-2 rounded-lg"
          >
            Pending
          </button>

          <button
            onClick={() => submitOrder("Paid")}
            className="bg-[#F28C28] text-white px-5 py-2 rounded-lg"
          >
            Paid
          </button>
        </div>
      </div>

      {/* PENDING MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white w-[600px] rounded-xl p-8 relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-[#4D1C0A] mb-6">
              Customer Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block font-semibold">Customer Name</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={customerData.name}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-semibold">Phone Number</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={customerData.phone}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-semibold">Due Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-4 py-2"
                  value={customerData.dueDate}
                  onChange={(e) =>
                    setCustomerData({
                      ...customerData,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => submitOrder("Pending")}
                className="bg-[#F28C28] text-white px-10 py-3 rounded-lg"
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
