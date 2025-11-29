import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

function TransactionList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusChange = (orderId, newStatus) => {
    fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Status updated:", data);

        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId ? { ...o, status: newStatus } : o
          )
        );
      });
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Orders:", data);
        setOrders(data);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

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

        <div className="flex items-center justify-between mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 border border-gray-300 rounded-lg py-1.5 px-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#F8961E]/50 transition-all"
            />
          </div>

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
              <li>
                <a onClick={() => setSelectedStatus("All")}>All</a>
              </li>
              <li>
                <a onClick={() => setSelectedStatus("Paid")}>Paid</a>
              </li>
              <li>
                <a onClick={() => setSelectedStatus("Pending")}>Pending</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-t border-gray-700">  
                <th className="text-gray-700">Order ID</th>
                <th className="text-gray-700">Status</th>
                <th className="text-gray-700">Customer</th>
                <th className="text-gray-700">Contact Number</th>
                <th className="text-gray-700">Total Amount</th>
                <th className="text-gray-700">Due Date</th>
                <th className="text-gray-700">Order Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.order_id}>
                    <td className="text-gray-700">{o.order_id}</td>

                    <td>
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

                    <td className="text-gray-700">{o.cus_name}</td>
                    <td className="text-gray-700">{o.contact_num}</td>
                    <td className="text-gray-700">₱{o.total_amt}</td>
                    <td className="text-gray-700">{o.due_date}</td>
                    <td className="text-gray-700">{o.order_date}</td>
                 
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default TransactionList;
