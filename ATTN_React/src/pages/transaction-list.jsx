import { useEffect, useState } from "react";
import { Search, ChevronDown, Eye } from "lucide-react";

function TransactionList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // ------------------------------
  // UPDATE ORDER STATUS
  // ------------------------------
  const handleStatusChange = (orderId, newStatus) => {
    fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId ? { ...o, status: newStatus } : o
          )
        );
      });
  };

  // ------------------------------
  // FETCH ALL ORDERS
  // ------------------------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders/")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // ------------------------------
  // OPEN MODAL & FETCH ORDER ITEMS
  // ------------------------------
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);

    fetch(`http://127.0.0.1:8000/api/orders/${order.order_id}/items/`)
      .then((res) => res.json())
      .then((data) => {
        setOrderItems(data);
        setShowModal(true);
      })
      .catch((err) => console.error("Error fetching items:", err));
  };

  // ------------------------------
  // SEARCH + FILTER LOGIC
  // ------------------------------
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.cus_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.order_id?.toString().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "" || selectedStatus === "All"
        ? true
        : o.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold text-[#4D1C0A] mb-4">
        Transaction List
      </h1>

      <div className="rounded-xl p-6 shadow-lg bg-gradient-to-br from-white to-gray-50">

        <div className="border-b pb-2 border-[#4D1C0A] mb-4">
          <h2 className="font-semibold text-lg text-[#4D1C0A]">Orders</h2>
        </div>

        {/* Search + Status Filter */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 border border-gray-300 rounded-lg py-1.5 px-3 text-gray-800 bg-white"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm cursor-pointer shadow-sm flex items-center gap-2"
              >
                {selectedStatus || "All Status"}
                <ChevronDown className="w-4 h-4 ml-1" />
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-white rounded-lg w-36 mt-2 border border-gray-200 text-gray-500"
              >
                <li><a onClick={() => setSelectedStatus("All")}>All</a></li>
                <li><a onClick={() => setSelectedStatus("Paid")}>Paid</a></li>
                <li><a onClick={() => setSelectedStatus("Pending")}>Pending</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-y-auto max-h-[520px] overflow-y-auto mt-4 rounded-lg bg-white shadow-inner">
          <table className="w-full min-w-[800px] table-auto">
            <thead>
              <tr className="text-left bg-gray-50 border-b sticky top-0 z-10">
                <th className="px-4 py-3 text-sm text-gray-600">Order ID</th>
                <th className="px-4 py-3 text-sm text-gray-600">Status</th>
                <th className="px-4 py-3 text-sm text-gray-600">Customer</th>
                <th className="px-4 py-3 text-sm text-gray-600">Contact</th>
                <th className="px-4 py-3 text-sm text-gray-600">Total</th>
                <th className="px-4 py-3 text-sm text-gray-600">Due Date</th>
                <th className="px-4 py-3 text-sm text-gray-600">Order Date</th>
                <th className="px-4 py-3 text-sm text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400 py-6">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.order_id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-800 font-medium">{o.order_id}</td>

                    <td className="px-4 py-3">
                      <select
                        className={`border rounded px-3 py-1 text-sm font-medium focus:outline-none ${o.status === "Paid"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o.order_id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-gray-800">{o.cus_name}</td>
                    <td className="px-4 py-3 text-gray-800">{o.contact_num}</td>
                    <td className="px-4 py-3 text-gray-800">₱{o.total_amt}</td>
                    <td className="px-4 py-3 text-gray-800">{o.due_date}</td>
                    <td className="px-4 py-3 text-gray-800">{o.order_date}</td>
                    <td className="px-4 py-3">
                      <button
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-[#F8961E] text-white 
             hover:bg-[#e7891b] transition-all duration-200 shadow-sm 
             hover:shadow-md active:scale-95"
                        onClick={() => viewOrderDetails(o)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= Modal ================= */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[650px] rounded-xl p-6 shadow-xl relative">

            {/* Close */}
            <button
              className="absolute top-3 right-4 text-xl text-gray-600 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2 className="text-xl font-bold text-[#4D1C0A] mb-4">
              Order Details
            </h2>

            {/* Order Info */}
            <div className="space-y-2 text-gray-700 mb-4">
              <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
              <p><strong>Status:</strong><span
                className={`px-3 py-1 text-xs font-semibold rounded-full 
      ${selectedOrder.status === "Paid" ? "bg-green-100 text-green-700" : ""}
      ${selectedOrder.status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""}
    `}
              >
                {selectedOrder.status}
              </span></p>
              <p><strong>Customer:</strong> {selectedOrder.cus_name}</p>
              <p><strong>Contact:</strong> {selectedOrder.contact_num}</p>
              <p><strong>Total Amount:</strong> ₱{selectedOrder.total_amt}</p>
              <p><strong>Due Date:</strong> {selectedOrder.due_date}</p>
              <p><strong>Order Date:</strong> {selectedOrder.order_date}</p>
            </div>

            <hr className="my-3" />

            {/* Ordered Items Table */}
            <h3 className="text-lg font-bold text-[#4D1C0A] mb-2">
              Ordered Items
            </h3>

            <div className="max-h-[240px] overflow-y-auto border rounded-lg">
              <table className="table table-sm w-full text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-gray-800">Product</th>
                    <th className="px-3 py-2 text-gray-800">Category</th>
                    <th className="px-3 py-2 text-gray-800">Qty</th>
                    <th className="px-3 py-2 text-gray-800">Price</th>
                    <th className="px-3 py-2 text-gray-800">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">{item.product_name}</td>
                      <td className="px-3 py-2">{item.category}</td>
                      <td className="px-3 py-2">{item.qty}</td>
                      <td className="px-3 py-2">₱{item.selling_price}</td>
                      <td className="px-3 py-2 font-semibold">₱{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Close Button
            <div className="text-center mt-5">
              <button
                className="btn bg-[#F8961E] text-white px-10"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div> */}

          </div>
        </div>
      )}


    </div>
  );
}

export default TransactionList;
