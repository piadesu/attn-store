import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DebtList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

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
  // AGGREGATE PENDING ORDERS BY CUSTOMER
  // ------------------------------
  const aggregatedPendingOrders = () => {
    const pendingOrders = orders.filter((o) => o.status === "Pending");
    const aggregation = {};

    pendingOrders.forEach((o) => {
      const name = o.cus_name || "Unknown";
      if (!aggregation[name]) {
        aggregation[name] = { ...o, total_amt: parseFloat(o.total_amt || 0) };
      } else {
        aggregation[name].total_amt += parseFloat(o.total_amt || 0);
      }
    });

    return Object.values(aggregation);
  };

  // ------------------------------
  // SEARCH + FILTER LOGIC
  // ------------------------------
  const filteredOrders = aggregatedPendingOrders().filter((o) =>
    o.cus_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // TOTAL PENDING AMOUNT
  const totalPendingAmount = aggregatedPendingOrders().reduce(
    (sum, o) => sum + o.total_amt,
    0
  );

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold text-[#4D1C0A] mb-4">Debt List</h1>

      {/* ===== TOTAL PENDING AMOUNT (NEW STYLE) ===== */}
      <div className="mt-2 mb-4 p-4 bg-white shadow-md rounded-lg border-l-4 border-[#F8961E]">
        <p className="text-lg font-semibold text-[#4D1C0A]">
          Total Pending Amount:{" "}
          <span className="text-red-600">
            ₱{totalPendingAmount.toLocaleString()}
          </span>
        </p>
      </div>

      <div className="rounded-xl p-6 shadow-lg bg-gradient-to-br from-white to-gray-50">

        <div className="border-b pb-2 border-[#4D1C0A] mb-4">
          <h2 className="font-semibold text-lg text-[#4D1C0A]">Pending Orders</h2>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 border border-gray-300 rounded-lg py-1.5 px-3 text-gray-800 bg-white"
            />
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-y-auto max-h-[520px] mt-4 rounded-lg bg-white shadow-inner">
          <table className="w-full min-w-[700px] table-auto">
            <thead>
              <tr className="text-left bg-gray-50 border-b">
                <th className="px-4 py-3 text-sm text-gray-600">Customer</th>
                <th className="px-4 py-3 text-sm text-gray-600">Total Pending Amount</th>
                <th className="px-4 py-3 text-sm text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-gray-400 py-6">
                    No pending orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-800 font-medium">{o.cus_name}</td>
                    <td className="px-4 py-3 text-gray-800">₱{o.total_amt.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        className="btn btn-xs bg-[#F8961E] text-white hover:bg-[#d97d17] shadow-sm border-0"
                        onClick={() => navigate(`/debt-transaction/${o.cus_name}`)}
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

    </div>
  );
}

export default DebtList;
