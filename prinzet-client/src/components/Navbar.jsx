import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { FaRupeeSign, FaShoppingCart } from "react-icons/fa";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();

  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false);
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(
    !!localStorage.getItem("vendorInfo")
  );
  const [vendorName, setVendorName] = useState(
    JSON.parse(localStorage.getItem("vendorInfo"))?.pressName || ""
  );
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);

  useEffect(() => {
    const vendor = JSON.parse(localStorage.getItem("vendorInfo"));
    if (user && user.isAdmin) {
      setIsAdmin(true);
      setIsVendorLoggedIn(false);
    } else if (vendor) {
      setVendorName(vendor.pressName);
      setIsVendorLoggedIn(true);
      setIsAdmin(false);
    } else {
      setIsAdmin(false);
      setIsVendorLoggedIn(false);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target)
      ) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };

  }, []);


  const categoryLinks = [
    { name: "Document Printing", path: "/category/document-printing" },
    { name: "Accessory Printing", path: "/accessory-category-details" },
    { name: "3D Printing", path: "/category/3d-printing" },
    { name: "3D Infra Design", path: "/category/3d-infra-design" },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("vendorInfo");
    setIsVendorLoggedIn(false);
    setVendorName("");
    setDropdownOpen(false);
    navigate("/");
  };

  const closeServicesDropdown = () => {
    setServicesDropdownOpen(false);
  };

  const closeUserDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-md lg:px-24 md:px-3 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          <img src={logo} alt="logo" className="w-auto h-20" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex py-5 space-x-6">
          <Link
            to="/"
            className="text-gray-700 font-semibold hover:text-blue-600 transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-semibold hover:text-gray-900 cursor-pointer"
          >
            About
          </Link>



          <div ref={servicesDropdownRef} className="relative">
            <button
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 font-semibold hover:text-blue-600 transition"
            >
              Our Services
              <FiChevronDown />
            </button>
            {servicesDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                {categoryLinks.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={closeServicesDropdown}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/price-calculator"
            className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center"
          >
            <FaRupeeSign /> Price Calculator
          </Link>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center"
            >
              Admin Dashboard
            </Link>
          )}

          {isVendorLoggedIn && (
            <Link
              to="/vendor/dashboard"
              className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center"
            >
              Vendor Dashboard
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-6 relative">
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {(user || isVendorLoggedIn) ? (
            <div ref={userDropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                <span className="font-medium">
                  {user ? user.fullName : vendorName}
                </span>
                <FiChevronDown />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeUserDropdown}>Dashboard</Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeUserDropdown}>Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={closeUserDropdown}>Order History</Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={closeUserDropdown}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={closeUserDropdown}
                  >
                    Order History
                  </Link>
                  <Link
                    to="/user/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={closeUserDropdown}
                  >
                    My Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      closeUserDropdown();
                    }}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Sign Up
              </Link>

            </div>
          )}
        </div>

        <button
          className="md:hidden text-gray-800 text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>



      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-16 left-0 w-full py-4">
          <div className="flex flex-col space-y-4 px-6">
            {/* Same as your old mobile links... */}
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <div ref={servicesDropdownRef} className="relative">
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 font-semibold hover:text-blue-600 transition"
              >
                Our Services
                <FiChevronDown />
              </button>
              {servicesDropdownOpen && (
                <div className="mt-2 bg-white shadow-lg rounded-lg py-2">
                  {categoryLinks.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        closeServicesDropdown();
                        setMobileMenuOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/price-calculator"
              className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaRupeeSign /> Price Calculator
            </Link>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            {isVendorLoggedIn && (
              <Link
                to="/vendor/dashboard"
                className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vendor Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Cart Icon */}
          <div className="flex items-center justify-between px-6 mt-4">
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile User / Vendor Section */}
          <div className="border-t mt-4 pt-4 px-6">
            {(user || isVendorLoggedIn) ? (
              <div ref={userDropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full text-left flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <span className="font-medium">
                    {user ? user.fullName : vendorName}
                  </span>
                  <FiChevronDown />
                </button>

                {dropdownOpen && (
                  <div className="mt-2 bg-white shadow-lg rounded-lg py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        closeUserDropdown();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        closeUserDropdown();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeUserDropdown();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
