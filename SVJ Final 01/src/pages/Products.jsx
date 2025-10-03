import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div
      className="container py-5"
      style={{
        background: "linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2
          className="fw-bold"
          style={{ color: "#1e40af", textShadow: "1px 1px 3px #cbd5e1" }}
        >
          Products
        </h2>
        <Link
          to="/create"
          className="btn text-white shadow bg-primary"
          style={{
            
            borderRadius: "10px",
          }}
        >
          + New Product
        </Link>
      </div>

      {/* Table Card */}
      <div
        className="card shadow border-0"
        style={{ overflow: "hidden" }}
      >
        <div
          className="card-header text-white fw-semibold bg-black"
          style={{
            fontSize: "16px",
          }}
        >
          Product List
        </div>
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0">
            <thead
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
              }}
            >
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Category</th>
                <th>SubCategory</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} style={{ verticalAlign: "middle" }}>
                    <td>{p.id}</td>
                    <td className="fw-semibold">{p.title}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.status === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                        style={{ fontSize: "12px" }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>{p.category}</td>
                    <td>{p.subCategory}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-sm text-white shadow"
                        style={{
                          background: "linear-gradient(90deg, #ef4444, #b91c1c)",
                          borderRadius: "8px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}