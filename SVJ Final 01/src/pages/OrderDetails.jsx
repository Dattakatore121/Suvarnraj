import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import mockOrders from "../data2/mockOrders";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LOCAL_KEY = "orders";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  // ✅ Load order from localStorage or mockOrders
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    const orders = saved ? JSON.parse(saved) : mockOrders;
    const foundOrder = orders.find((o) => String(o.id) === id);
    setOrder(foundOrder);
  }, [id]);

  if (!order) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-danger">❌ Order Not Found</h3>
        <Link to="/ordersList" className="btn btn-primary mt-3">
          Back to Orders
        </Link>
      </div>
    );
  }

  // ✅ Generate Invoice PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Cleaning Services Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text("Company: Leemecode PVT LTD", 14, 28);
    doc.text("Email: leemcode@cleanpro.com | Phone: +91-9876543210", 14, 34);
    doc.line(14, 38, 196, 38);

    // Customer Info
    doc.setFontSize(14);
    doc.text("Customer Information:", 14, 48);

    doc.setFontSize(12);
    doc.text(`Transaction ID: ${order.transactionId}`, 14, 56);
    doc.text(`Name: ${order.customerName}`, 14, 64);
    doc.text(`Email: ${order.email}`, 14, 72);
    doc.text(`Phone: ${order.phone}`, 14, 80);
    doc.text(`Address: ${order.address}`, 14, 88);
    doc.text(`Cleaning Date: ${order.cleaningDate}`, 14, 96);
    doc.text(`Status: ${order.status}`, 14, 104);
    doc.text(`Payment Status: ${order.paymentStatus}`, 14, 112);
    doc.text(`Date Purchased: ${order.datePurchased}`, 14, 120);

    // Products Table
    const tableColumn = ["Product", "Qty", "Price", "Total"];
    const tableRows = [];

    order.products.forEach((item) => {
      tableRows.push([
        item.name,
        item.qty,
        `${item.price}`,
        `${item.qty * item.price}`,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 130,
    });

    // Summary Section
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Subtotal: ${order.subtotal} Rs.`, 14, finalY);
    doc.text(`Discount: ${order.discount} Rs.`, 14, finalY + 8);
    doc.text(`Shipping: ${order.shipping} Rs.`, 14, finalY + 16);
    doc.text(`Paid Amount: ${order.paidAmount} Rs.`, 14, finalY + 24);
    doc.text(`Remaining Amount: ${order.remainingAmount} Rs.`, 14, finalY + 32);

    doc.setFontSize(14);
    doc.text(`Grand Total: ${order.amount} Rs.`, 14, finalY + 48);

    // Footer
    doc.setFontSize(10);
    doc.text(
      "Thank you for choosing CleanPro! Visit us again.",
      14,
      doc.internal.pageSize.height - 20
    );

    doc.save(`invoice_${order.transactionId}.pdf`);
  };

  // ✅ Update Status & Save to localStorage
  const handleStatusChange = (newStatus) => {
    const updatedOrder = { ...order, status: newStatus };
    setOrder(updatedOrder);

    const saved = localStorage.getItem(LOCAL_KEY);
    const orders = saved ? JSON.parse(saved) : mockOrders;

    const updatedOrders = orders.map((o) =>
      o.id === order.id ? updatedOrder : o
    );

    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedOrders));
    alert(`✅ Order status updated to: ${newStatus}`);
  };

  // ✅ View SOP (Sample PDF)
  const viewSOP = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Standard Operating Procedure (SOP)", 14, 20);
    doc.setFontSize(12);
    doc.text("1. Confirm booking details", 14, 40);
    doc.text("2. Assign cleaning team", 14, 50);
    doc.text("3. Carry required equipment", 14, 60);
    doc.text("4. Perform cleaning as scheduled", 14, 70);
    doc.text("5. Take customer feedback", 14, 80);
    doc.text("6. Close the job and update system", 14, 90);
    doc.save(`SOP_${order.transactionId}.pdf`);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* LEFT SIDE */}
        <div className="col-md-8 mb-3">
          <div className="card mb-3 shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Customer Information</h5>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Cleaning Date:</strong> {order.cleaningDate}</p>
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    order.status === "Confirmed"
                      ? "bg-success"
                      : order.status === "Pending"
                      ? "bg-warning"
                      : "bg-danger"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p><strong>Date Purchased:</strong> {order.datePurchased}</p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Ordered Items</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.qty * item.price}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Subtotal</td>
                      <td>₹{order.subtotal}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Discount</td>
                      <td>- ₹{order.discount}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Shipping</td>
                      <td>₹{order.shipping}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Paid</td>
                      <td>₹{order.paidAmount}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Remaining</td>
                      <td>₹{order.remainingAmount}</td>
                    </tr>
                    <tr className="table-dark">
                      <td colSpan="3" className="text-end fw-bold">Grand Total</td>
                      <td className="fw-bold">₹{order.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-4">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0 d-flex justify-content-center align-items-center">Order Actions</h5>
            </div>
            <div className="card-body d-grid gap-2">
              {/* Update Status with dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-success dropdown-toggle"
                  style={{ width: "100%" }}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  ✅ Update Status
                </button>
                <ul className="dropdown-menu w-100">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleStatusChange("Confirmed")}
                    >
                      Confirmed
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleStatusChange("Pending")}
                    >
                      Pending
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleStatusChange("Cancelled")}
                    >
                      Cancelled
                    </button>
                  </li>
                </ul>
              </div>

              {/* Generate Invoice */}
              <button className="btn btn-primary" onClick={generatePDF}>
                🧾 Generate Invoice
              </button>

              {/* View SOP */}
              <button className="btn btn-warning" onClick={viewSOP}>
                📋 View SOP
              </button>

              {/* Back */}
              <Link to="/ordersList" className="btn btn-outline-secondary">
                ← Back to Orders
              </Link>
            </div>
          </div>

          {/* Extra Info */}
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">Extra Notes</h6>
            </div>
            <div className="card-body">
              <p className="text-muted">
                This section can be used for shipping updates, payment notes, or
                admin comments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
