export default function Dashboard() {
  return (
    <>
      {/* Stats Cards.. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border-l-4 border-[#F8961E] p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Top-Selling Product</p>
          <h2 className="text-xl font-bold text-[#F8961E] mt-1">
            Mighty Bond
          </h2>
        </div>
        <div className="bg-white border-l-4 border-[#F8961E] p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-xl font-bold text-[#F8961E] mt-1">1234</h2>
        </div>
        <div className="bg-white border-l-4 border-[#F8961E] p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Total Sales</p>
          <h2 className="text-xl font-bold text-[#F8961E] mt-1">₱1234</h2>
        </div>
      </div>

      {/* Analytics Box */}
      <div className="bg-white border border-[#F8961E]/30 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Analytics
        </h2>
        <div className="w-full h-60 sm:h-72 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm sm:text-base">
          Analytics Chart Placeholder
        </div>
      </div>
    </>
  );
}
