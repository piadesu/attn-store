import { useState, useEffect } from "react";
import { Bell, User, ChevronDown, Menu, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Topbar({ onMenuClick, pageTitle }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const ordersRes = await fetch("http://127.0.0.1:8000/api/orders/");
        const orders = await ordersRes.json();

        const productsRes = await fetch("http://127.0.0.1:8000/api/products/");
        const products = await productsRes.json();

        const stockNotifications = generateStockNotifications(orders, products);
        setNotifications(stockNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Notification logic
  const generateStockNotifications = (orders, products) => {
    const productWeeks = {};

    orders.forEach((order) => {
      if (!order.items) return;

      order.items.forEach((item) => {
        const name = item.product_name.toLowerCase().trim();
        const qty = parseInt(item.qty) || 0;

        if (!productWeeks[name]) productWeeks[name] = { total: 0 };
        productWeeks[name].total += qty;
      });
    });

    const stockNotifications = [];

    products.forEach((product) => {
      const productName = (product.display_name || product.name).toLowerCase();
      const weeklyDemand = productWeeks[productName]?.total || 0;
      const dailyDemand = weeklyDemand / 7;
      const daysLeft = dailyDemand > 0 ? Math.floor(product.stock / dailyDemand) : null;

      if (product.stock === 0) {
        stockNotifications.push({
          id: product.id,
          productName: product.display_name || product.name,
          message: `${product.display_name || product.name} is OUT OF STOCK!`,
          read: false,
        });
      } else if (daysLeft !== null && daysLeft <= 5) {
        stockNotifications.push({
          id: product.id,
          productName: product.display_name || product.name,
          message: `${product.display_name || product.name} will run out in ${daysLeft} day(s)`,
          read: false,
        });
      }
    });

    return stockNotifications;
  };

  const handleNotificationClick = (productName) => {
    const encoded = encodeURIComponent(productName);
    navigate(`/analytics?product=${encoded}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-4 sm:px-6 z-30 relative">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="block lg:hidden text-[#4D1C0A] p-2 rounded-md border border-[#4D1C0A]"
        >
          <Menu size={24} />
        </button>

        <h1 className="hidden lg:block text-2xl font-bold text-[#4D1C0A]">
          {pageTitle}
        </h1>
      </div>

      {/* MOBILE LOGO */}
      <div className="absolute left-1/2 transform -translate-x-1/2 lg:hidden">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-bold text-[#F8961E]">ATTN</h1>
          <p className="text-gray-700 text-sm">STORE</p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">
        
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="p-2 border border-[#4D1C0A] rounded-full text-[#4D1C0A]">
              <User size={22} />
            </div>

            {/* Show REAL USER NAME */}
            <span className="text-[#4D1C0A] font-medium hidden sm:block">
              {user ? `${user.first_name} ${user.last_name}` : "Guest"}
            </span>

            <ChevronDown
              size={18}
              className={`text-[#4D1C0A] transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border py-2">
              <div className="px-4 py-2 border-b">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#4D1C0A] font-semibold text-sm">
                    Notifications
                  </span>
                  <Bell size={16} className="text-[#4D1C0A]" />
                </div>

                {notifications.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.productName)}
                        className="text-sm text-gray-700 px-2 py-1 rounded-md flex items-start gap-2 bg-[#FBEED7] cursor-pointer hover:bg-[#f6e4c0]"
                      >
                        <AlertTriangle size={14} className="text-red-500 mt-0.5" />
                        <span>{notif.message}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No notifications</p>
                )}
              </div>

              {/* EDIT PROFILE BUTTON */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/editprofile");
                }}
                className="w-full text-left px-4 py-2 text-[#4D1C0A] hover:bg-[#4D1C0A]/10"
              >
                Edit Profile
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
