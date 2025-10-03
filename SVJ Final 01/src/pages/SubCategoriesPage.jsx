import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const SubCategoriesPage = ({ subCategories, deleteSubCategory }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = subCategories.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => setSearchTerm("");

  return (
    <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 rounded shadow mb-4">
        <h3 className="fw-bold m-0 d-flex align-items-center gap-2">
          <i className="ri-apps-fill"></i> Sub-Categories
        </h3>

        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Search by name, slug, parent..."
            className="form-control form-control-sm shadow-sm"
            style={{ width: "240px" }}
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

      {/* Table */}
      <div className="card shadow rounded-3 border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Parent Category</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td className="fw-semibold">{item.name}</td>
                      <td className="text-primary">{item.slug}</td>
                      <td>{item.parent}</td>
                      <td className="text-center">
                        <span
                          className={`badge px-3 py-2 ${
                            item.status === "Active" ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <NavLink
                            to={`/editsubcategory/${item.id}`}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          >
                            <i className="ri-edit-2-line"></i> Edit
                          </NavLink>
                          {/* <button
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            onClick={() => deleteSubCategory(item.id)}
                          >
                            <i className="ri-delete-bin-6-line"></i> Delete
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No sub-categories found
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
};

export default SubCategoriesPage;