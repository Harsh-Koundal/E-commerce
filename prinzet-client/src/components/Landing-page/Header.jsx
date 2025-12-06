import React, { useState, useRef, useEffect } from "react";
import { FaHeadset, FaUser, FaBoxOpen, FaDownload } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoReorderThreeOutline, IoHomeOutline } from "react-icons/io5";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { SlCalculator } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { logoImg } from "@/assets";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { IoLogOutOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";

const Header = () => {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false);
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(
    !!localStorage.getItem("vendorInfo")
  );
  const [vendorName, setVendorName] = useState(
    JSON.parse(localStorage.getItem("vendorInfo"))?.pressName || ""
  );
  const navigate = useNavigate();

  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  useEffect(() => {
    const vendor = JSON.parse(localStorage.getItem("vendorInfo"));
    if (user && user?.isAdmin) {
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
  const handleLogout = () => {
    logout();
    localStorage.removeItem("vendorInfo");
    setIsVendorLoggedIn(false);
    setVendorName("");
    setDropdownOpen(false);
    navigate("/");
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideSidebar = (e) => {
      if (
        mobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSidebar);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
  }, [mobileMenuOpen]);

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : isVendorLoggedIn
    ? "/vendor/dashboard"
    : "/user/dashboard";

  return (
    <nav className="bg-white shadow left-0 w-full z-50 sticky top-0">
      <div className="flex items-center justify-between px-6 py-1">
        <div className="flex items-center gap-2">
          <Link to="/">
            {" "}
            <img src={logoImg} alt="Printzet" className="h-20" />
          </Link>
        </div>
        <div className="hidden md:flex items-center lg:gap-10 gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-pink-600 lg:text-xl text-md font-normal"
          >
            <IoHomeOutline /> Home
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-2 hover:text-pink-600 lg:text-xl font-normal text-md"
          >
            <AiOutlineShoppingCart /> Cart
            {cartCount > 0 && (
              <sup className="ml-1 text-sm bg-pink-600 text-white rounded-full px-2">
                {cartCount}
              </sup>
            )}
          </Link>
          <Link
            to="/price-calculator"
            className="flex items-center gap-2 hover:text-pink-600 text-md lg:text-xl font-normal whitespace-nowrap"
          >
            <SlCalculator size={18} /> &#8377; Price Calculator
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 hover:text-pink-600 font-normal text-md lg:text-xl whitespace-nowrap"
            >
              <RiAdminLine /> Admin Dashboard
            </Link>
          )}
          {isVendorLoggedIn && (
            <Link
              to="/vendor/dashboard"
              className="flex items-center gap-2 hover:text-pink-600 text-md font-normal lg:text-xl whitespace-nowrap"
            >
              <RiAdminLine /> Vendor Dashboard
            </Link>
          )}
        </div>
        <div className="hidden md:flex items-center relative" ref={dropdownRef}>
          <div onClick={() => setDropdownOpen(false)}>
            <div className="flex items-center gap-2 cursor-pointer hover:text-pink-600 text-md lg:text-xl whitespace-nowrap">
              {!user && !isVendorLoggedIn ? (
                <div className="flex items-center justify-center">
                  <Link className="flex gap-2" to={"/login"}>
                    <CgProfile className="mt-1.5" /> Sign-in
                  </Link>{" "}
                </div>
              ) : (
                <div
                  className="flex items-center lg:gap-2 gap-1 justify-center"
                  onClick={() => handleLogout()}
                >
                  <IoLogOutOutline className="mt-1" /> Log-out
                </div>
              )}
            </div>
          </div>
          <div
            className="text-3xl lg:ml-6 ml-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <IoReorderThreeOutline />
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 top-10 bg-white border rounded shadow-lg w-48 z-50">
              <div className="px-4 py-2 font-semibold flex items-center gap-2 whitespace-nowrap">
                Hello {user ? user?.fullName : vendorName}
              </div>
              <Link
                to={dashboardPath}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <RiAdminLine /> Dashboard
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <FaUser />
                About Us
              </Link>

              <Link
                to="/contact"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <FaHeadset /> Help Centre
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <CgProfile /> Your Account
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <FaBoxOpen /> My Orders
              </Link>
              <Link
                to="/download"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <FaDownload /> Download App
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <IoReorderThreeOutline
            size={28}
            className="cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
          <div
            ref={sidebarRef}
            className="w-64 h-full bg-white shadow-lg p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-1">
              <Link to={"/"}>
                {" "}
                <img src={logoImg} alt="Printzet" className="h-16" />
              </Link>
              <IoMdClose
                size={28}
                className="cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
            <div className="py-2 font-semibold flex items-center gap-2 whitespace-nowrap">
              <FaUser /> Hello {user ? user?.fullName : vendorName}
            </div>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 hover:text-pink-600 font-normal lg:text-xl"
              >
                <RiAdminLine /> Admin Dashboard
              </Link>
            )}
            {isVendorLoggedIn && (
              <Link
                to="/vendor/dashboard"
                className="flex items-center gap-2 hover:text-pink-600 font-normal lg:text-xl"
              >
                <RiAdminLine /> Vendor Dashboard
              </Link>
            )}
            <Link
              to="/"
              className="flex items-center gap-2 py-2 hover:text-pink-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <IoHomeOutline /> Home
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 py-2 hover:text-pink-600 relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <AiOutlineShoppingCart /> Cart
              {cartCount > 0 && (
                <sup className="ml-1 text-xs bg-pink-600 text-white rounded-full px-2">
                  {cartCount}
                </sup>
              )}
            </Link>
            <Link
              to="/price-calculator"
              className="flex items-center gap-2 py-2 hover:text-pink-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <SlCalculator /> &#8377; Price Calculator
            </Link>
            <div className="flex flex-col mb-6 border-b pb-6">
              <Link
                to={dashboardPath}
                className="flex items-center gap-2 py-2 hover:text-pink-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <RiAdminLine /> Dashboard
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 py-2 hover:text-pink-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser /> About Us
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 py-2 hover:text-pink-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHeadset /> Help Centre
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 py-2 hover:text-pink-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CgProfile /> Your Account
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-2 py-2 hover:text-pink-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaBoxOpen /> My Orders
              </Link>
              <a
                href="/"
                className="flex items-center gap-2 py-2 hover:text-pink-600"
              >
                <FaDownload /> Download App
              </a>
            </div>

            <Link to={"/login"}>
              <div className="flex items-center gap-2 py-2 cursor-pointer hover:text-pink-600 text-lg font-semibold">
                {!user && !isVendorLoggedIn ? (
                  <div className="flex items-center justify-center">
                    <Link
                      className="flex gap-2"
                      to={"/login"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <CgProfile className="mt-1.5" /> Sign-in
                    </Link>{" "}
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 justify-center"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <IoLogOutOutline className="mt-1" /> Log-out
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
