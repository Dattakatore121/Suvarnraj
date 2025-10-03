import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function AsideContainer({ isOpen }) {
  const [openDropdown, setOpenDropdown] = useState("");

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  return (
    <aside
      className={`h-100 position-fixed top-0 start-0 bg-white shadow-lg`}
      style={{
        width: isOpen ? "260px" : "80px",
        overflowX: "hidden",
        transition: "width 0.4s ease",
        zIndex: 2,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Brand */}
      <div
        className="d-flex align-items-center justify-content-center gap-2 border-bottom px-3"
        style={{
          height: "71px",
          background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
          color: "white",
        }}
      >
        <div
          className="bg-white d-flex justify-content-center align-items-center text-primary rounded-circle p-2 shadow-sm"
          style={{ height: "55px", width: "55px" }}
        >
          <i className="ri-admin-fill fs-5"></i>
        </div>
        {isOpen && <h6 className="m-0 fw-bold">SRG SUPER-ADMIN</h6>}
      </div>

      {/* Navigation */}
      <div style={{ height: "calc(100vh - 70px)", overflowY: "auto" }}>
        <nav className="d-flex flex-column py-4">

          {/* Simple Links */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active-link fw-bold" : ""
              }`
            }
          >
            <i className="ri-dashboard-3-fill"></i>
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/calender"
            className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active-link fw-bold" : ""
              }`
            }
          >
            <i className="ri-calendar-fill"></i>
            {isOpen && <span>Calendar</span>}
          </NavLink>

          {/* Dropdown: Manage Service */}
          <div className="menu-dropdown">
            <div
              className="menu-link d-flex align-items-center gap-2 px-3 py-2"
              style={{ cursor: "pointer" }}
              onClick={() => toggleDropdown("service")}
            >
              <i className="ri-service-fill"></i>
              {isOpen && <span>Manage Service</span>}
              {isOpen && <i className="ri-arrow-down-s-line ms-auto"></i>}
            </div>
            {isOpen && openDropdown === "service" && (
              <div className="submenu ps-4">
                <NavLink to="/product" className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "bg-success text-white fw-bold" : ""
              }`
            }>
                  Products
                </NavLink>

                <NavLink to="/categories" className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "bg-success text-white fw-bold" : ""
              }`
            }>
                  Categories
                </NavLink>

                <NavLink to="/sub-categories" className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "bg-success text-white fw-bold" : ""
              }`
            }>
                  Sub Categories
                </NavLink>
              </div>
            )}
          </div>

          {/* Other Links */}
          <NavLink
            to="/shipping"
            className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active-link fw-bold" : ""
              }`
            }
          >
            <i className="ri-truck-fill"></i>
            {isOpen && <span>Shipping</span>}
          </NavLink>

          <NavLink
            to="/ordersList"
            className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active-link fw-bold" : ""
              }`
            }
          >
            <i className="ri-shape-fill"></i>
            {isOpen && <span>Website Orders</span>}
          </NavLink>

          <NavLink
            to="/discounts"
            className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active-link fw-bold" : ""
              }`
            }
          >
            <i className="ri-discount-percent-fill"></i>
            {isOpen && <span>Discounts</span>}
          </NavLink>

          <NavLink
            to="/enquiries"
            className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active-link fw-bold" : ""
              }`
            }
          >
            <i className="ri-chat-smile-fill"></i>
            {isOpen && <span>Enquiries</span>}
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active-link fw-bold" : ""
              }`
            }
          >
            <i className="ri-contacts-fill"></i>
            {isOpen && <span>Contact Us</span>}
          </NavLink>

          <NavLink
            to="/registered-users"
            className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "active-link fw-bold" : ""
              }`
            }
          >
            <i className="ri-registered-fill"></i>
            {isOpen && <span>Registered Users</span>}
          </NavLink>

          {/* Dropdown: Call Booking */}
          <div className="menu-dropdown">
            <div
              className="menu-link d-flex align-items-center gap-2 px-3 py-2"
              style={{ cursor: "pointer" }}
              onClick={() => toggleDropdown("call")}
            >
              <i className="ri-bookmark-2-fill"></i>
              {isOpen && <span>Call Booking</span>}
              {isOpen && <i className="ri-arrow-down-s-line ms-auto"></i>}
            </div>
            {isOpen && openDropdown === "call" && (
              <div className="submenu ps-4">
                <NavLink to="/quotations" className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "bg-success text-white fw-bold" : ""
              }`
            }>
                  Quotations
                </NavLink>
                <NavLink to="/quot-orders" className={({ isActive }) =>
              `menu-link d-flex align-items-center gap-2 px-3 py-2 ${
                isActive ? "bg-success text-white fw-bold" : ""
              }`
            }>
                  Quot Converted Orders
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default AsideContainer;
