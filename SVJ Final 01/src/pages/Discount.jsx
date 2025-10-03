import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Eye,
  Trash2,
  Power,
  RefreshCw,
  Download,
} from "lucide-react";
import "./discount.css";
import * as XLSX from "xlsx";

// Utility functions
const money = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const dmy = (d) => (d ? new Date(d).toLocaleDateString() : "");

function statusOf(discount) {
  const today = new Date();
  const s = new Date(discount.startDate);
  const e = new Date(discount.endDate);
  if (!discount.isActive) return "Inactive";
  if (today < s) return "Upcoming";
  if (today > e) return "Expired";
  return "Active";
}

function StatusBadge({ status }) {
  const styles = {
    Active: "badge bg-success",
    Upcoming: "badge bg-primary",
    Expired: "badge bg-warning text-dark",
    Inactive: "badge bg-secondary",
  };
  return (
    <span className={`${styles[status]} px-3 py-2 rounded-pill fw-semibold`}>
      {status}
    </span>
  );
}

export default function Discount() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [open, setOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    type: "percentage",
    value: "",
    startDate: "",
    endDate: "",
    isActive: true,
    usage: 0,
  });

  // Hardcoded API - replace if needed
  const API = "http://localhost:3000/discounts";

  // Fetch discounts
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching discounts:", err);
      alert(
        "Failed to fetch discounts. Make sure json-server is running at " + API
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open || viewData ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, viewData]);

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setType("all");
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const s = (search || "").trim().toLowerCase();
      const matchSearch =
        !s ||
        (r.id && r.id.toString().toLowerCase().includes(s)) ||
        (r.name && r.name.toString().toLowerCase().includes(s));
      const st = statusOf(r);
      const matchStatus = status === "all" || st.toLowerCase() === status;
      const matchType = type === "all" || r.type === type;
      return matchSearch && matchStatus && matchType;
    });
  }, [rows, search, status, type]);

  // Delete discount (re-fetch after success)
  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?"))
      return;
    try {
      await axios.delete(`${API}/${encodeURIComponent(id)}`);
      await fetchDiscounts();
    } catch (err) {
      console.error("Error deleting discount:", err);
      alert("Failed to delete discount. Check console.");
    }
  };

  // Toggle active/inactive (PATCH + re-fetch)
  const onToggleActive = async (id) => {
    try {
      const row = rows.find((r) => r.id === id);
      if (!row) return;
      await axios.patch(`${API}/${encodeURIComponent(id)}`, {
        isActive: !row.isActive,
      });
      await fetchDiscounts();
    } catch (err) {
      console.error("Error toggling active:", err);
      alert("Failed to update status. Check console.");
    }
  };
  const exportExcel = () => {
    const data = filtered.map((r) => ({
      Code: r.id,
      Name: r.name,
      Type: r.type,
      Value: r.type === "percentage" ? `${r.value}%` : money(Number(r.value)),
      Start: dmy(r.startDate),
      End: dmy(r.endDate),
      Status: statusOf(r),
      Usage: r.usage,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Discounts");

    XLSX.writeFile(workbook, "discounts.xlsx");
  };

  const closeModal = () => {
    setOpen(false);
    setEditMode(false);
    setViewData(null);
    setForm({
      id: "",
      name: "",
      type: "percentage",
      value: "",
      startDate: "",
      endDate: "",
      isActive: true,
      usage: 0,
    });
  };

  // Create or Update discount
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = (form.id || "").toString().trim();
    const valueNum = Number(form.value);

    if (!id) return alert("Please enter a discount code.");
    if (!form.name.trim()) return alert("Please enter a name.");
    if (!form.startDate || !form.endDate)
      return alert("Please select start and end dates.");
    if (new Date(form.endDate) < new Date(form.startDate))
      return alert("End date must be after start date.");
    if (!Number.isFinite(valueNum) || valueNum <= 0)
      return alert("Please enter a valid value > 0.");

    try {
      if (editMode) {
        await axios.put(`${API}/${encodeURIComponent(id)}`, {
          ...form,
          value: valueNum,
          usage: Number(form.usage || 0),
          isActive: !!form.isActive,
        });
      } else {
        if (rows.some((r) => String(r.id).toLowerCase() === id.toLowerCase())) {
          alert("Discount code already exists.");
          return;
        }
        await axios.post(API, {
          ...form,
          id,
          value: valueNum,
          usage: Number(form.usage || 0),
          isActive: !!form.isActive,
        });
      }
      await fetchDiscounts();
      closeModal();
    } catch (err) {
      console.error("Error saving discount:", err);
      alert("Failed to save discount. Check console.");
    }
  };

  return (
    <div className="discount-page container-fluid py-4">
      {/* Header */}
      <div className="discount-header text-white p-4 rounded-4 shadow mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-1 text-black">Discount Management</h2>
            <p className="mb-0 opacity-75 text-black">
              Manage and track all discount codes
            </p>
          </div>
          <div className="d-flex gap-2">
            {/* Export CSV */}
            <button className="btn btn-light shadow-sm" onClick={exportExcel}>Export</button>

            {/* New discount */}
            <button
              className="btn btn-warning text-dark fw-semibold shadow-sm"
              onClick={() => {
                setOpen(true);
                setEditMode(false);
                setForm({
                  id: "",
                  name: "",
                  type: "percentage",
                  value: "",
                  startDate: "",
                  endDate: "",
                  isActive: true,
                  usage: 0,
                });
              }}
            >
              <Plus size={16} className="me-1" /> New Discount
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search discount..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-outline-primary w-100">
                <Filter size={16} className="me-1" /> Apply
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={resetFilters}
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-lg border-0">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Value</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Usage</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-muted">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((r, idx) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01, backgroundColor: "#f8f9fa" }}
                    transition={{ duration: 0.2 }}
                  >
                    <td>{idx + 1}</td>
                    <td className="text-black">{r.id}</td>
                    <td>{r.name}</td>
                    <td className="text-capitalize">{r.type}</td>
                    <td>
                      {r.type === "percentage"
                        ? `${r.value}%`
                        : money(Number(r.value))}
                    </td>
                    <td>{dmy(r.startDate)}</td>
                    <td>{dmy(r.endDate)}</td>
                    <td>
                      <StatusBadge status={statusOf(r)} />
                    </td>
                    <td>{r.usage}</td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => setViewData(r)}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => {
                            setForm({ ...r, value: String(r.value) });
                            setEditMode(true);
                            setOpen(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(r.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => onToggleActive(r.id)}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-muted">
                    No discounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewData && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Discount Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Code:</strong> {viewData.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {viewData.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {viewData.type}
                  </p>
                  <p>
                    <strong>Value:</strong>{" "}
                    {viewData.type === "percentage"
                      ? `${viewData.value}%`
                      : money(viewData.value)}
                  </p>
                  <p>
                    <strong>Start:</strong> {dmy(viewData.startDate)}
                  </p>
                  <p>
                    <strong>End:</strong> {dmy(viewData.endDate)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <StatusBadge status={statusOf(viewData)} />
                  </p>
                  <p>
                    <strong>Usage:</strong> {viewData.usage}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Create/Edit Modal */}
      {open && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editMode ? "Edit Discount" : "Create New Discount"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.id}
                          onChange={(e) =>
                            setForm({ ...form, id: e.target.value })
                          }
                          required
                          disabled={editMode}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Type</label>
                        <select
                          className="form-select"
                          value={form.type}
                          onChange={(e) =>
                            setForm({ ...form, type: e.target.value })
                          }
                        >
                          <option value="percentage">Percentage</option>
                          <option value="flat">Flat</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Value</label>
                        <input
                          type="number"
                          className="form-control"
                          value={form.value}
                          onChange={(e) =>
                            setForm({ ...form, value: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={form.startDate}
                          onChange={(e) =>
                            setForm({ ...form, startDate: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={form.endDate}
                          onChange={(e) =>
                            setForm({ ...form, endDate: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
