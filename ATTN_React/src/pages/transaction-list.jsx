import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 days");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch transactions from Django API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/transactions/")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  // Filter by search term
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.order_id.toString().includes(searchTerm);

    // Optional: filter by status if you have a status field
    const matchesStatus =
      selectedStatus === "" || selectedStatus === "All"
        ? true
        : selectedStatus === "Paid"
        ? t.status === "Paid"
        : t.status === "Pending";

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold text-[#4D1C0A] mb-4">Transaction List</h1>

      <div className="border rounded-xl p-6 shadow-sm bg-white">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-2 border-b pb-2">
          <h2 className="font-bold text-[#4D1C0A]">Transactions</h2>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 border border-gray-300 rounded-lg py-1.5 px-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#F8961E]/50 focus:border-[#F8961E] transition-all"
              />
            </div>

            {/* Status Dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-sm btn-outline border-gray-300 hover:bg-gray-50 hover:border-gray-400 normal-case font-normal text-gray-700"
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th></th>
                <th>Order ID</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Contact Number</th>
                <th>Total Amount</th>
                <th>Debt Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.trans_id}>
                    <td></td>
                    <td>{t.order_id}</td>
                    <td>{t.type}</td>
                    <td>{t.customer}</td>
                    <td>{t.cont_number}</td>
                    <td>₱{t.tot_amount}</td>
                    <td>{t.debt_date}</td>
                    <td>{t.due_date}</td>
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
