import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Save, XCircle } from "lucide-react"; // icons

export default function CreateProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: "",
    status: "active",
    category: "",
    subCategory: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    navigate("/product");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f9fafb, #eef2f7, #e2e8f0)",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          borderRadius: "20px",
          width: "100%",
          maxWidth: "800px",
          animation: "fadeIn 0.8s ease-in-out",
        }}
      >
        {/* Header */}
        <div
          className="card-header text-white d-flex align-items-center gap-2"
          style={{
            background: "linear-gradient(90deg, #2563eb, #1e40af)",
            padding: "20px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          <PackagePlus size={32} />
          <div>
            <h2 className="h4 fw-bold mb-0">Create New Product</h2>
            <small className="text-light">
              Add details for your product listing
            </small>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-body p-4">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter product title"
              required
            />
          </div>

          {/* Slug + Price */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="form-control"
                placeholder="product-slug"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Short Description</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="form-control"
              rows="2"
              placeholder="Enter short description"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Enter detailed description"
              required
            />
          </div>

          {/* Categories */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter category"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Sub Category</label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter sub category"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="btn btn-light d-flex align-items-center gap-2 shadow-sm"
              style={{ borderRadius: "10px" }}
            >
              <XCircle size={18} /> Cancel
            </button>
            <button
              type="submit"
              className="btn text-white d-flex align-items-center gap-2 shadow"
              style={{
                background: "linear-gradient(90deg, #2563eb, #1e40af)",
                borderRadius: "10px",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Save size={18} /> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}