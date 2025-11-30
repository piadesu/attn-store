import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [todaySalesCount, setTodaySalesCount] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [topProduct, setTopProduct] = useState("Loading...");
  const [dailySales, setDailySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // Fetch ordered items
    fetch("http://127.0.0.1:8000/api/ordereditem/")
      .then((res) => res.json())
      .then((data) => {
        const today = new Date();
        const todayMonth = today.getMonth() + 1;
        const todayYear = today.getFullYear();
        const todayDate = today.getDate();

        // Filter today's orders
        const todaysItems = data.filter((item) => {
          if (!item.order_date) return false;
          const orderDate = new Date(item.order_date);
          return (
            orderDate.getDate() === todayDate &&
            orderDate.getMonth() + 1 === todayMonth &&
            orderDate.getFullYear() === todayYear
          );
        });

        // Count qty sold today
        const totalQty = todaysItems.reduce(
          (sum, item) => sum + (item.qty || 0),
          0
        );
        setTodaySalesCount(totalQty);

        // Compute profit
        const totalProfit = todaysItems.reduce((sum, item) => {
          const sell = parseFloat(item.selling_price || 0);
          const cost = parseFloat(item.cost_price || 0);
          const qty = parseInt(item.qty || 0, 10);
          return sum + (sell - cost) * qty;
        }, 0);
        setTodayProfit(totalProfit);

        // TOP-SELLING PRODUCT OVERALL
        const productTotals = {};
        data.forEach((item) => {
          const name = item.product_name;
          productTotals[name] = (productTotals[name] || 0) + (item.qty || 0);
        });

        const sortedProducts = Object.entries(productTotals).sort(
          (a, b) => b[1] - a[1]
        );

        setTopProduct(sortedProducts.length ? sortedProducts[0][0] : "No sales");
      })
      .catch((err) => console.error("Error fetching ordered items:", err));

    // Fetch analytics (daily sales & top 5)
    fetch("http://127.0.0.1:8000/api/analytics/")
      .then((res) => res.json())
      .then((data) => {
        setDailySales(data.daily_sales || []);
        setTopProducts(data.top_products || []);
      })
      .catch((err) => console.error("Analytics fetch error:", err));
  }, []);

  return (
    <>
      {/* ====== STAT CARDS ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Top Selling */}
        <div className="bg-white border-l-4 border-[#F8961E] p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Top-Selling Product</p>
          <h2 className="text-xl font-bold text-[#F8961E] mt-1">{topProduct}</h2>
        </div>

        {/* Today's Sales */}
        <div className="bg-white border-l-4 border-[#F8961E] p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Today's Sales</p>
          <h2 className="text-xl font-bold text-[#F8961E] mt-1">
            {todaySalesCount}
          </h2>
        </div>

        {/* Today's Profit */}
        <div className="bg-white border-l-4 border-[#F8961E] p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Today's Profit</p>
          <h2 className="text-xl font-bold text-[#F8961E] mt-1">
            ₱{todayProfit.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* ====== ANALYTICS - DAILY SALES ====== */}
      <div className="bg-white border border-[#F8961E]/30 rounded-lg p-6 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Daily Sales (Past 7 Days)
        </h2>

        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="order_date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#F8961E" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== ANALYTICS - TOP 5 PRODUCTS ====== */}
      <div className="bg-white border border-[#F8961E]/30 rounded-lg p-6 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Top 5 Best-Selling Products
        </h2>

        <div className="w-full h-72">
          <ResponsiveContainer>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_qty" fill="#F8961E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
