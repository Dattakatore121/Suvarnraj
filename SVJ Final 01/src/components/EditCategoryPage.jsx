// src/components/EditCategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "true",
  });

  // Mock data load (replace with API call)
  useEffect(() => {
    const mockCategory = {
      id,
      name: "Luxury Villas",
      slug: "luxury-villas",
      status: "true",
    };
    setFormData(mockCategory);
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler
  const handleSave = () => {
    console.log("Updated category:", formData);
    alert(`✅ Category "${formData.name}" updated successfully!`);
    navigate("/categories");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div
          className="card-header text-white"
          style={{ backgroundColor: "#0d6efd", fontSize: "18px" }}
        >
          <i className="bi bi-pencil-square me-2"></i> Edit Category #{id}
        </div>

        {/* Body */}
        <div className="card-body bg-white p-4">
          <form>
            {/* Category Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter category name"
              />
            </div>

            {/* Slug */}
            <div className="mb-3">
              <label className="form-label">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter slug"
              />
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="true">✅ Active</option>
                <option value="false">❌ Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-primary px-4 me-2"
                onClick={handleSave}
              >
                💾 Save
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate("/categories")}
              >
                ✖ Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="card-footer text-center text-muted" style={{ fontSize: "13px" }}>
          © 2025-26 Suvarnaraj Group | Edit Categories
        </div>
      </div>
    </div>
  );
}