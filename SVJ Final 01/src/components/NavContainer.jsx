import React from "react";

function NavContainer({ toggleSidebar }) {
  return (
    <nav
      className="d-flex justify-content-between align-items-center px-3 py-2 shadow-sm bg-white"
      /* style={{
        background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
        color: "white",
      }} */
    >
      <div className="d-flex align-items-center gap-3">
        <button className="btn border-0 text-black" onClick={toggleSidebar}>
          <i className="ri-menu-line fs-3"></i>
        </button>
        <h5 className="m-0 fw-bold d-none d-sm-block">SRG Admin</h5>
      </div>
      {/* Search + Notifications + Profile remain unchanged */}
    </nav>
  );
}

export default NavContainer;
