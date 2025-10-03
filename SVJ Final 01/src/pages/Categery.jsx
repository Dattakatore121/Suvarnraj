// src/pages/CategoriesPage.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Categery() {
  const [categories] = useState([
    { id: 2, name: "Flats", slug: "flats", status: true },
    { id: 1, name: "Custom Home Cleaning", slug: "custom-home-cleaning", status: true },
    { id: 3, name: "Luxury Villas", slug: "luxury-villas", status: false },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => setSearchTerm("");

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Page Header */}
      <div
        className="d-flex justify-content-between align-items-center p-3 rounded shadow mb-4"
        /* style={{
          background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
          color: "white",
        }} */
      >
        <h3 className="fw-bold m-0 d-flex align-items-center gap-2">
          <i className="ri-folders-fill"></i> Categories
        </h3>

        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Search categories..."
            className="form-control form-control-sm shadow-sm"
            style={{ width: "220px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-sm fw-bold text-white shadow"
            style={{ backgroundColor: "#20c997" }}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card shadow rounded-3 border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td className="fw-semibold">{cat.name}</td>
                      <td className="text-primary">{cat.slug}</td>
                      <td className="text-center">
                        {cat.status ? (
                          <span className="badge bg-success px-3 py-2">Active</span>
                        ) : (
                          <span className="badge bg-danger px-3 py-2">Inactive</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-3">
                          <NavLink
                            to="/editcategory"
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          >
                            <i className="ri-edit-2-line"></i> Edit
                          </NavLink>
                          {/* <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
                            <i className="ri-delete-bin-6-line"></i> Delete
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-muted mt-4" style={{ fontSize: "14px" }}>
        © 2025-26 Suvarnaraj Group. All rights reserved.
      </div>
    </div>
  );
}