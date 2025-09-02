import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

interface Notification {
  _id: string;
  notifications_title: string;
  created_at: string;
}

interface NotificationWithRead {
  notification: Notification;
  read: boolean;
}

interface NotificationModalProps {
  notifications: NotificationWithRead[];
  closeModal: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  closeModal,
}) => {
  const sortedNotifications = notifications.sort((a, b) => {
    return a.read === b.read
      ? new Date(b.notification.created_at).getTime() -
      new Date(a.notification.created_at).getTime()
      : a.read
        ? 1
        : -1;
  });

  const unreadNotifications = sortedNotifications.filter(
    (notification) => !notification.read
  );
  const readNotifications = sortedNotifications.filter(
    (notification) => notification.read
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md max-h-[80vh] overflow-hidden border border-gray-200">
        <div
          className="flex justify-between items-center p-6 border-b border-gray-100"
          style={{ borderBottomColor: "#F2F1ED" }}
        >
          <h2
            className="text-xl font-bold flex items-center"
            style={{ color: "#161616" }}
          >
            <FaBell className="mr-3" style={{ color: "#710014" }} />
            Notifications
          </h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100"
            style={{ color: "#161616" }}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {unreadNotifications.length > 0 && (
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "#161616" }}
              >
                Unread
              </h3>
              {unreadNotifications.map((notification) => (
                <Link
                  key={notification.notification._id}
                  to={`/notifications/${notification.notification._id}`}
                  onClick={closeModal}
                  className="block group"
                >
                  <div
                    className="border-l-4 p-4 rounded-r-xl mb-3 transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor: "#F2F1ED",
                      borderLeftColor: "#710014",
                    }}
                  >
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "#161616" }}
                    >
                      {notification.notification.notifications_title}
                    </p>
                    <span className="text-xs" style={{ color: "#B38F6F" }}>
                      {new Date(
                        notification.notification.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {readNotifications.length > 0 && (
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "#161616" }}
              >
                Read
              </h3>
              {readNotifications.map((notification) => (
                <Link
                  key={notification.notification._id}
                  to={`/notifications/${notification.notification._id}`}
                  onClick={closeModal}
                  className="block group"
                >
                  <div
                    className="p-4 rounded-xl mb-3 transition-all duration-200 hover:shadow-md border"
                    style={{
                      backgroundColor: "white",
                      borderColor: "#F2F1ED",
                    }}
                  >
                    <p className="text-sm mb-1" style={{ color: "#161616" }}>
                      {notification.notification.notifications_title}
                    </p>
                    <span className="text-xs" style={{ color: "#B38F6F" }}>
                      {new Date(
                        notification.notification.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {unreadNotifications.length === 0 &&
            readNotifications.length === 0 && (
              <div className="text-center py-12">
                <FaBell
                  className="w-12 h-12 mx-auto mb-4 opacity-40"
                  style={{ color: "#B38F6F" }}
                />
                <p className="text-sm" style={{ color: "#B38F6F" }}>
                  No notifications available
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenu] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [notifications, setNotifications] = useState<NotificationWithRead[]>(
    []
  );
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  // Fetch notifications and user data
  useEffect(() => {
    const fetchUserData = async () => {
      const storedId = localStorage.getItem("_id");
      const storedName = localStorage.getItem("name");
      const storedProfilePic = localStorage.getItem("profile_pic");
      setUserRole(localStorage.getItem("role"));

      if (storedId) {
        setUserId(storedId);
        setUsername(storedName || "");
        setProfilePic(storedProfilePic || "");

        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/notifications/${storedId}`
          );
          if (!response.ok) throw new Error("Failed to fetch notifications");

          const data = await response.json();
          setNotifications(data.notifications);
          setNewNotificationCount(data.unreadCount);
        } catch (error) {
          console.error("Notification fetch error:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BACKEND_URL
          : "http://localhost:5000";

      const token = localStorage.getItem("token"); // JWT stored after login

      const response = await fetch(`${baseUrl}/api/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ attach JWT
        },
        credentials: "include", // keep if your backend uses cookies
      });

      if (response.ok) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Render mobile menu
  const renderMobileMenu = () => (
    <div
      className={`fixed inset-0 z-40 transform transition-all duration-300 ease-in-out 
        ${isMobileMenuOpen
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0"
        }`}
      style={{ backgroundColor: "#161616" }}
    >
      <div className="h-full flex flex-col">
        <div
          className="p-6 flex justify-between items-center border-b"
          style={{ borderBottomColor: "#B38F6F" }}
        >
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full transition-colors duration-200"
            style={{ color: "#F2F1ED" }}
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-6 space-y-2">
          {[
            { to: "/properties", label: "Properties" },
            { to: "/marketplace", label: "Marketplace" },
            { to: "/contact", label: "Contact Us" },
            { to: "/about", label: "About Us" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-lg font-medium py-4 px-4 rounded-xl transition-all duration-200 hover:bg-opacity-20"
              style={{
                color: "#F2F1ED",
              }}
              // Use Tailwind's hover:bg-[#B38F6F] if you want a hover background color
              // className="... hover:bg-[#B38F6F]"
              onClick={toggleMobileMenu}
            >
              {label}
            </Link>
          ))}

          <div className="pt-6 space-y-2">
            <Link
              to="/vendor-application"
              className="block text-base py-3 px-4 rounded-xl transition-all duration-200"
              style={{ color: "#B38F6F" }}
              onClick={toggleMobileMenu}
            >
              Become a Vendor
            </Link>
            <Link
              to="/upgrade-to-channelpartner"
              className="block text-base py-3 px-4 rounded-xl transition-all duration-200"
              style={{ color: "#B38F6F" }}
              onClick={toggleMobileMenu}
            >
              Upgrade to Channel Partner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Render profile dropdown
  const renderProfileMenu = () => (
    <div
      className={`absolute z-50 right-0 top-full w-72 bg-white shadow-2xl rounded-2xl mt-3 overflow-hidden border transition-all duration-200 ${isProfileMenuOpen
          ? "opacity-100 visible transform translate-y-0"
          : "opacity-0 invisible transform -translate-y-2"
        }`}
      style={{ borderColor: "#F2F1ED" }}
    >
      <div
        className="p-6 border-b flex items-center"
        style={{ borderBottomColor: "#F2F1ED", backgroundColor: "#F2F1ED" }}
      >
        <img
          src={profilePic}
          alt="Profile"
          className="w-14 h-14 rounded-full mr-4 object-cover border-2"
          style={{ borderColor: "#710014" }}
        />
        <div>
          <p className="font-bold text-lg" style={{ color: "#161616" }}>
            {username}
          </p>
          <p className="text-sm" style={{ color: "#B38F6F" }}>
            View Profile
          </p>
        </div>
      </div>
      <div className="py-2">
        {[
          { to: `/dashboard/${userId}`, icon: FaUser, label: "Dashboard" },
          ...(userRole !== "user"
            ? [
              {
                to: `/channelpartner/${userId}`,
                icon: FaUser,
                label: "Channel Partner Dashboard",
              },
            ]
            : []),
          ...(userRole === "vendor"
            ? [
              {
                to: `/vendordashboard`,
                icon: FaUser,
                label: "Vendor Dashboard",
              },
            ]
            : []),
          { to: "/settings", icon: FaCog, label: "Settings" },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center px-6 py-3 transition-all duration-200 hover:bg-opacity-50"
            style={{
              color: "#161616",
            }}
            onClick={() => setIsProfileMenuOpen(false)}
          >
            <Icon className="mr-4 w-4 h-4" style={{ color: "#710014" }} />
            {label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 transition-all duration-200 hover:bg-red-50"
          style={{ color: "#710014" }}
        >
          <FaSignOutAlt className="mr-4 w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  // Render more dropdown
  const renderMoreNav = () => (
    <div
      className={`absolute z-50 right-0 top-full w-64 bg-white shadow-2xl rounded-2xl mt-3 overflow-hidden border transition-all duration-200 ${isMoreMenuOpen
          ? "opacity-100 visible transform translate-y-0"
          : "opacity-0 invisible transform -translate-y-2"
        }`}
      style={{ borderColor: "#F2F1ED" }}
    >
      <div className="py-2">
        <Link
          to="/vendor-application"
          className="flex items-center px-6 py-4 transition-all duration-200 hover:bg-[#F2F1ED]"
          style={{
            color: "#161616",
          }}
          onClick={() => setIsMoreMenu(false)}
        >
          <span className="font-medium">Become a Vendor</span>
        </Link>
        <Link
          to="/upgrade-to-channelpartner"
          className="flex items-center px-6 py-4 transition-all duration-200 hover:bg-[#F2F1ED]"
          style={{
            color: "#161616",
          }}
          onClick={() => setIsMoreMenu(false)}
        >
          <span className="font-medium">Upgrade to Channel Partner</span>
        </Link>
      </div>
    </div>
  );

  return (
    <nav
      className="bg-white shadow-lg relative border-b-2"
      style={{ borderBottomColor: "#F2F1ED" }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
          >
            <img src="/logo.png" alt="Logo" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {[
              { to: "/properties", label: "Properties" },
              { to: "/marketplace", label: "Marketplace" },
              { to: "/contact", label: "Contact Us" },
              { to: "/about", label: "About Us" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-base font-medium transition-all duration-200 hover:text-opacity-80 relative group"
                style={{ color: "#161616" }}
              >
                {label}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full"
                  style={{ backgroundColor: "#710014" }}
                ></span>
              </Link>
            ))}

            <div className="relative">
              <button
                className="flex items-center text-base font-medium transition-all duration-200 hover:text-opacity-80 group"
                style={{ color: "#161616" }}
                onClick={() => setIsMoreMenu(!isMoreMenuOpen)}
              >
                More
                <FaChevronDown
                  className={`ml-2 w-3 h-3 transition-transform duration-200 ${isMoreMenuOpen ? "rotate-180" : ""
                    }`}
                />
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full"
                  style={{ backgroundColor: "#710014" }}
                ></span>
              </button>
              {renderMoreNav()}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="relative p-2 rounded-full transition-all duration-200 hover:bg-opacity-10"
              style={{ backgroundColor: "#F2F1ED" }}
            >
              <FaBell className="w-5 h-5" style={{ color: "#710014" }} />
              {newNotificationCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#710014" }}
                >
                  {newNotificationCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full transition-all duration-200"
              style={{ color: "#161616" }}
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop User Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {!userId ? (
              <Link
                to="/login"
                className="px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                style={{
                  backgroundColor: "#710014",
                  color: "#F2F1ED",
                }}
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    className="relative p-3 rounded-full transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: "#F2F1ED" }}
                    onClick={() => setIsNotificationModalOpen(true)}
                  >
                    <FaBell
                      className="w-5 h-5"
                      style={{
                        color: newNotificationCount > 0 ? "#710014" : "#B38F6F",
                      }}
                    />
                    {newNotificationCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: "#710014" }}
                      >
                        {newNotificationCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-full transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: "#F2F1ED" }}
                  >
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2"
                      style={{ borderColor: "#710014" }}
                    />
                    <FaChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""
                        }`}
                      style={{ color: "#161616" }}
                    />
                  </button>
                  {renderProfileMenu()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {renderMobileMenu()}

      {/* Notification Modal */}
      {isNotificationModalOpen && (
        <NotificationModal
          notifications={notifications}
          closeModal={() => setIsNotificationModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
