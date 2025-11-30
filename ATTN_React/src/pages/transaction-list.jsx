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

      <div className="border rounded-xl p-6 shadow-sm bg-white">

        <div className="border-b pb-2 border-gray-700 mb-4">
          <h2 className="font-bold text-[#4D1C0A]">Orders</h2>
        </div>

        {/* Search + Status Filter */}
        <div className="flex items-center justify-between mb-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 border border-gray-300 rounded-lg py-1.5 px-3 text-gray-800 bg-white"
            />
          </div>

          {/* Status Dropdown */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-sm btn-outline border-gray-300 hover:bg-gray-50 normal-case font-normal text-gray-700"
            >
              {selectedStatus || "Status"}
              <ChevronDown className="w-4 h-4 ml-1" />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-lg bg-white rounded-lg w-36 mt-2 border border-gray-200"
            >
              <li><a onClick={() => setSelectedStatus("All")}>All</a></li>
              <li><a onClick={() => setSelectedStatus("Paid")}>Paid</a></li>
              <li><a onClick={() => setSelectedStatus("Pending")}>Pending</a></li>
            </ul>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-y-auto max-h-[450px] mt-4 border rounded-lg">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-t border-gray-700">
                <th className="text-gray-800">Order ID</th>
                <th className="text-gray-800">Status</th>
                <th className="text-gray-800">Customer</th>
                <th className="text-gray-800">Contact</th>
                <th className="text-gray-800">Total</th>
                <th className="text-gray-800">Due Date</th>
                <th className="text-gray-800">Order Date</th>
                <th className="text-gray-800">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.order_id}>
                    <td className="text-gray-800">{o.order_id}</td>

                    <td className="text-gray-800">
                      <select
                        className="border rounded px-2 py-1 text-gray-800"
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o.order_id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>

                    <td className="text-gray-800">{o.cus_name}</td>
                    <td className="text-gray-800">{o.contact_num}</td>
                    <td className="text-gray-800">₱{o.total_amt}</td>
                    <td className="text-gray-800">{o.due_date}</td>
                    <td className="text-gray-800">{o.order_date}</td>
                    <td>
                      <button
                        className="btn btn-xs bg-[#F8961E] text-white hover:bg-[#d97d17]"
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
              className="absolute top-3 right-4 text-xl font-bold"
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
              <p><strong>Status:</strong> {selectedOrder.status}</p>
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
                <thead className="bg-gray-100 border-b">
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
                    <tr key={idx} className="border-b">
                      <td className="px-3 py-2">{item.product_name}</td>
                      <td className="px-3 py-2">{item.category}</td>
                      <td className="px-3 py-2 text-center">{item.qty}</td>
                      <td className="px-3 py-2">₱{item.selling_price}</td>
                      <td className="px-3 py-2 font-semibold">₱{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Close Button */}
            <div className="text-center mt-5">
              <button
                className="btn bg-[#F8961E] text-white px-10"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}


    </div>
  );
}

export default TransactionList;
