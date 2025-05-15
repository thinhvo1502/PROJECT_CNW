import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, User, LogOut, Settings, Crown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAuthPage = isLoginPage || isRegisterPage;
  const { isAuthenticated, user, logout } = useAuth();
  if (isAuthPage) {
    return (
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 item-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">IT Quiz</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-md font-medium ${
                isRegisterPage
                  ? "border border-blue-600 text-blue-600"
                  : "bg-blue-600 text-white"
              }`}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-md font-medium ${
                isLoginPage
                  ? "border border-blue-600 text-blue-600"
                  : "bg-blue-600 text-white"
              }`}
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>
    );
  }
  const menuItems = [
    { name: "Trang chủ", path: "/home" },
    { name: "Làm bài", path: "/exam" },
    { name: "Lịch sử làm bài", path: "/history" },
    { name: "Thống kê học tập", path: "/statistics" },
    { name: "Gợi ý thông minh", path: "/suggestions" },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };
  const handleLogout = () => {
    setIsProfileOpen(false);
    navigate("/logout");
  };
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-blue-600">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">IT Quiz</span>
          </Link>
          {/* desktop  */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              /* Profile Dropdown */
              <div className="relative ml-3">
                <button
                  onClick={toggleProfile}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage || "/placeholder.svg"}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Hồ sơ cá nhân
                      </div>
                    </Link>
                    <Link
                      to="/subscription"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                        Gói Premium
                      </div>
                    </Link>
                    <Link
                      to="/profile/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Cài đặt
                      </div>
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Đăng xuất
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Register buttons */
              <div className="flex items-center space-x-2 ml-3">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Mở menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Hồ sơ cá nhân
                  </div>
                </Link>
                <Link
                  to="/subscription"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                    Gói Premium
                  </div>
                </Link>
                <Link
                  to="/profile/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Cài đặt
                  </div>
                </Link>
                <Link
                  to="/logout"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Đăng xuất
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
export default Header;
