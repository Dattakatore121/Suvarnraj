// src/components/EditSubCategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditSubCategoryPage({ subCategories, updateSubCategory }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const subCategoryId = parseInt(id);

  const subCategoryToEdit = subCategories.find((sub) => sub.id === subCategoryId);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent: "",
    status: "true",
  });

  useEffect(() => {
    if (subCategoryToEdit) {
      setFormData({
        name: subCategoryToEdit.name,
        slug: subCategoryToEdit.slug,
        parent: subCategoryToEdit.parent,
        status: subCategoryToEdit.status === "Active" ? "true" : "false",
      });
    }
  }, [subCategoryToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateSubCategory(subCategoryId, {
      name: formData.name,
      slug: formData.slug,
      parent: formData.parent,
      status: formData.status === "true" ? "Active" : "Inactive",
    });
    alert(`✅ Sub-category ${subCategoryId} updated!`);
    navigate("/sub-categories");
  };

  if (!subCategoryToEdit) {
    return <div className="text-center mt-5 text-danger">❌ Sub-category not found.</div>;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-lg border-0" style={{ width: "100%", maxWidth: "550px" }}>
        <div className="card-header text-white" style={{ backgroundColor: "#0d6efd" }}>
          <h4 className="mb-0">✎ Edit Sub-category #{subCategoryId}</h4>
        </div>
        <div className="card-body bg-light">
          <form>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Slug */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Slug</label>
              <input
                type="text"
                className="form-control"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
              />
            </div>

            {/* Parent */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Parent Category</label>
              <input
                type="text"
                className="form-control"
                name="parent"
                value={formData.parent}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
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
                onClick={() => navigate("/sub-categories")}
              >
                ✖ Cancel
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer text-center text-muted" style={{ fontSize: "13px" }}>
          © 2025-26 Suvarnaraj Group | Edit Sub-categories
        </div>
      </div>
    </div>
  );
}