import { useState } from "react";
import { Bell, User, ChevronDown, Menu } from "lucide-react";

function Topbar({ onMenuClick, pageTitle  }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const notifications = [
    { id: 1, message: "New order received!", read: false },
    { id: 2, message: "Inventory updated.", read: true },
  ];

  return (
    
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-4 sm:px-6 top-0 left-0 z-30 relative">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Hamburger (visible only on mobile) */}
        <button
          onClick={onMenuClick}
          className="block lg:hidden text-[#4D1C0A] p-2 rounded-md border border-[#4D1C0A] hover:bg-[#4D1C0A]/10 transition"
        >
          <Menu size={24} />
        </button>

        {/* DASHBOARD title (desktop only) */}
        <h1 className="hidden lg:block text-2xl font-bold text-[#4D1C0A] leading-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Centered logo (mobile only) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 lg:hidden">
        <h1 className="text-2xl font-bold text-[#F8961E] leading-tight">ATTN</h1>
        <p className="mr-7 text-gray-700 text-sm tracking-wide">STORE</p>
      </div>

      {/* Right Section (User Info) */}
      <div className="flex items-center gap-6">
      

        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="p-2 border border-[#4D1C0A] rounded-full text-[#4D1C0A]">
              <User size={22} />
            </div>
            <span className="text-[#4D1C0A] font-medium hidden sm:block">
              Mushorf
            </span>
            <ChevronDown
              size={18}
              className={`text-[#4D1C0A] transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 py-2">
                {/* Notifications Section */}
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#4D1C0A] font-semibold text-sm">
                    Notifications
                  </span>
                  <Bell size={16} className="text-[#4D1C0A]" />
                </div>

                {notifications.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`text-sm px-2 py-1 rounded-md ${
                          notif.read
                            ? "text-gray-500"
                            : "text-[#4D1C0A] font-medium bg-[#FBEED7]"
                        }`}
                      >
                        {notif.message}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No notifications</p>
                )}
              </div>
                {/* Edit Profile Button */}
              <button
                onClick={() => alert("Edit Profile clicked!")}
                className="w-full text-left px-4 py-2 text-[#4D1C0A] hover:bg-[#4D1C0A]/10 transition"
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