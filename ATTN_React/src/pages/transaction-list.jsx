import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");


  const handleStatusChange = (transId, newStatus) => {
  fetch(`http://127.0.0.1:8000/api/transactions/update/${transId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Status updated:", data);

      // Update UI immediately
      setTransactions((prev) =>
        prev.map((t) =>
          t.trans_id === transId ? { ...t, status: newStatus } : t
        )
      );
    })
    .catch((err) => console.error("Error updating status:", err));
};


  // Fetch transactions from Django API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/transactions/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Transactions:", data);
        setTransactions(data);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  // Filter by search & status
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.cus_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.order?.toString().includes(searchTerm) ||
      t.trans_id?.toString().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "" || selectedStatus === "All"
        ? true
        : t.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold text-[#4D1C0A] mb-4">
        Transaction List
      </h1>

      <div className="border rounded-xl p-6 shadow-sm bg-white">
        {/* Header */}
        <div className="border-b pb-2 border-gray-700 mb-4">
          <h2 className="font-bold text-[#4D1C0A]">Transactions</h2>
        </div>

        {/* Search + Status */}
        <div className="flex items-center justify-between mb-2">
          {/* Search */}
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

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="table table-sm w-full">
            <thead>
              <tr className="border-b border-t border-gray-700">
                <th className="text-gray-800">Transaction ID</th>
                <th className="text-gray-800">Order ID</th>
                <th className="text-gray-800">Status</th>
                <th className="text-gray-800">Customer</th>
                <th className="text-gray-800">Contact Number</th>
                <th className="text-gray-800">Total Amount</th>
                <th className="text-gray-800">Due Date</th>
                 <th className="text-gray-800">Transaction Date</th>
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
                  <td className="text-gray-800">{t.trans_id}</td>
                  <td className="text-gray-800">{t.order}</td>

                  {/* STATUS DROPDOWN */}
                  <td>
                    <select
                      className="border rounded px-2 py-1 text-gray-800"
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.trans_id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>

                  <td className="text-gray-800">{t.cus_name}</td>
                  <td className="text-gray-800">{t.contact_num}</td>
                  <td className="text-gray-800">₱{t.total_amt}</td>
                  <td className="text-gray-800">{t.due_date}</td>
                  <td className="text-gray-800">{t.transaction_date}</td>
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
