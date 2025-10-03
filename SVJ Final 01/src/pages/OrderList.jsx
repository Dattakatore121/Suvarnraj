import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mockOrders from "../data2/mockOrders";

const LOCAL_KEY = "orders";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Load from localStorage if exists, otherwise from mockOrders
    const saved = localStorage.getItem(LOCAL_KEY);
    const initialOrders = saved ? JSON.parse(saved) : mockOrders;
    if (!saved) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(initialOrders));
    }
    setOrders(initialOrders);
  }, []);

  // Filtering
  const filteredOrders = (Array.isArray(orders) ? orders : []).filter((order) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.phone?.includes(search) ||
      String(order.id).includes(search);

    const matchesStatus =
      statusFilter === "All" ? true : order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortField === "datePurchased") {
      return sortOrder === "asc"
        ? new Date(a.datePurchased) - new Date(b.datePurchased)
        : new Date(b.datePurchased) - new Date(a.datePurchased);
    } else {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / itemsPerPage));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirst, indexOfLast);

  // Reset filters
  const handleReset = () => {
    setSearch("");
    setStatusFilter("All");
    setSortField("id");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Orders from Website</h2>

      {/* Controls */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, Name, Email, Phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="id">Sort by Order ID</option>
            <option value="amount">Sort by Amount</option>
            <option value="datePurchased">Sort by Date</option>
          </select>
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date Purchased</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-decoration-underline text-primary"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.email}</td>
                  <td>{order.phone}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "Confirmed"
                          ? "bg-success"
                          : order.status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>₹{order.amount}</td>
                  <td>{order.datePurchased}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-outline-secondary"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
