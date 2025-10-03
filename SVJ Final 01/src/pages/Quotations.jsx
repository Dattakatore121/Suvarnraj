import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { Search, Filter } from "lucide-react";
import axios from "axios";

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newQuotation, setNewQuotation] = useState({
    QuotationID: "",
    Honorific: "",
    Customer: "",
    Email: "",
    Phone: "",
    Address: "",
    Area: "",
    Commodities: [
      { name: "", price: 0, quantity: 1, unit: "", description: "" },
    ],
    DiscountType: "fixed",
    DiscountValue: 0,
    DateBooked: "",
    TimeBooked: "",
    GrandTotal: 0,
    Status: "Pending",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Fetch data
  const getQuots = async () => {
    try {
      let response = await axios.get("http://localhost:3000/quotationMgt");
      setQuotations(response.data);
    } catch (error) {
      console.log("Error fetching quotations: ", error.message);
    }
  };

  useEffect(() => {
    getQuots();
  }, []);

  // ✅ Calculate Grand Total
  useEffect(() => {
    let subtotal = newQuotation.Commodities.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    let discount = 0;
    if (newQuotation.DiscountType === "fixed") {
      discount = parseFloat(newQuotation.DiscountValue) || 0;
    } else if (newQuotation.DiscountType === "percentage") {
      discount =
        (subtotal * (parseFloat(newQuotation.DiscountValue) || 0)) / 100;
    }
    const grandTotal = subtotal - discount;
    setNewQuotation((prev) => ({
      ...prev,
      GrandTotal: grandTotal > 0 ? grandTotal : 0,
    }));
  }, [
    newQuotation.Commodities,
    newQuotation.DiscountType,
    newQuotation.DiscountValue,
  ]);

  // ✅ Filtered quotations
  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const matchSearch =
        q.Customer?.toLowerCase().includes(search.toLowerCase()) ||
        q.Phone?.includes(search) ||
        q.QuotationID?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || q.Status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [quotations, search, statusFilter]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ View details
  const handleView = (quotation) => {
    setModalData(quotation);
    setShowModal(true);
  };

  // ✅ Reset filters
  const handleReset = () => {
    setSearch("");
    setStatusFilter("all");
  };

  // ✅ Handle commodity change
  const handleCommodityChange = (index, field, value) => {
    const updatedCommodities = [...newQuotation.Commodities];
    updatedCommodities[index][field] = value;
    setNewQuotation({ ...newQuotation, Commodities: updatedCommodities });
  };

  // ✅ Add commodity
  const addCommodity = () => {
    setNewQuotation({
      ...newQuotation,
      Commodities: [
        ...newQuotation.Commodities,
        { name: "", price: 0, quantity: 1, unit: "", description: "" },
      ],
    });
  };

  // ✅ Create quotation (save minimal fields to server)
  const handleCreateQuotation = async () => {
    try {
      const saveData = {
        QuotationID: newQuotation.QuotationID,
        Customer: newQuotation.Customer,
        Phone: newQuotation.Phone,
        Area: newQuotation.Area,
        GrandTotal: newQuotation.GrandTotal,
        Status: newQuotation.Status,
      };
      await axios.post("http://localhost:3000/quotationMgt", saveData);

      setShowCreateModal(false);
      setNewQuotation({
        QuotationID: "",
        Honorific: "",
        Customer: "",
        Email: "",
        Phone: "",
        Address: "",
        Area: "",
        Commodities: [
          { name: "", price: 0, quantity: 1, unit: "", description: "" },
        ],
        DiscountType: "fixed",
        DiscountValue: 0,
        DateBooked: "",
        TimeBooked: "",
        GrandTotal: 0,
        Status: "Pending",
      });
      getQuots();
    } catch (error) {
      console.log("Error creating quotation:", error.message);
    }
  };

  return (
    <Card className="shadow-sm p-4 mb-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold">
            <span className="text-primary">
              <i className="ri-file-text-fill"></i>
            </span>{" "}
            Quotations Management
          </h2>
          <p className="m-0 text-muted">Manage and track all quotations</p>
        </div>
        <Button
          className="btn-primary d-flex align-items-center gap-2 shadow"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="ri-add-line fs-5"></i> Create New Quotation
        </Button>
      </div>

      {/* Filters */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <InputGroup className="w-50">
          <InputGroup.Text className="bg-white">
            <Search size={18} />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search by name, phone, or ID"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>

        <InputGroup style={{ width: "220px" }}>
          <InputGroup.Text className="bg-white">
            <Filter size={18} />
          </InputGroup.Text>
          <Form.Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Quotations</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
        </InputGroup>

        <Button variant="light" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* Table */}
      <div className="table-responsive shadow rounded">
        <Table striped hover className="mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th>Quotation ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Area</th>
              <th>Grand Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((q, idx) => (
                <tr key={idx}>
                  <td>{q.QuotationID}</td>
                  <td>{q.Customer}</td>
                  <td>{q.Phone}</td>
                  <td>{q.Area}</td>
                  <td>{q.GrandTotal}</td>
                  <td>
                    <span
                      className={`badge ${
                        q.Status === "Pending"
                          ? "bg-warning text-dark"
                          : q.Status === "Approved"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {q.Status}
                    </span>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleView(q)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-muted py-3">
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {/* View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Quotation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <div className="d-flex flex-column gap-2">
              <p>
                <strong>Quotation ID:</strong> {modalData.QuotationID}
              </p>
              <p>
                <strong>Honorific:</strong> {modalData.Honorific}
              </p>
              <p>
                <strong>Customer:</strong> {modalData.Customer}
              </p>
              <p>
                <strong>Email:</strong> {modalData.Email}
              </p>
              <p>
                <strong>Phone:</strong> {modalData.Phone}
              </p>
              <p>
                <strong>Address:</strong> {modalData.Address}
              </p>
              <p>
                <strong>Area:</strong> {modalData.Area}
              </p>
              <p>
                <strong>Date Booked:</strong> {modalData.DateBooked}
              </p>
              <p>
                <strong>Time Booked:</strong> {modalData.TimeBooked}
              </p>
              <p>
                <strong>Status:</strong> {modalData.Status}
              </p>
              <hr />
              <h5>Commodities</h5>
              <ul>
                {modalData.Commodities?.map((c, i) => (
                  <li key={i}>
                    {c.name} - {c.quantity} {c.unit} @ {c.price} (
                    {c.description})
                  </li>
                ))}
              </ul>
              <p>
                <strong>Discount:</strong> {modalData.DiscountType} -{" "}
                {modalData.DiscountValue}
              </p>
              <p>
                <strong>Grand Total:</strong> {modalData.GrandTotal}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quotation ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuotation.QuotationID}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        QuotationID: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Honorific</Form.Label>
                  <Form.Select
                    value={newQuotation.Honorific}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        Honorific: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                    <option>Prof.</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Customer</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuotation.Customer}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        Customer: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newQuotation.Email}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        Email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuotation.Phone}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        Phone: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Area</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuotation.Area}
                    onChange={(e) =>
                      setNewQuotation({ ...newQuotation, Area: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={newQuotation.Address}
                onChange={(e) =>
                  setNewQuotation({ ...newQuotation, Address: e.target.value })
                }
              />
            </Form.Group>

            <hr />

            {/* Commodities Section */}
            <h5 className="mb-3 fw-semibold">Commodities</h5>
            {newQuotation.Commodities.map((c, i) => (
              <div
                key={i}
                className="border rounded p-3 mb-3 bg-white shadow-sm position-relative"
              >
                {/* Header with remove button */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-semibold">
                    Commodity {i + 1}{" "}
                    <span className="badge bg-secondary ms-2">
                      {c.name || "Not Selected"}
                    </span>
                  </span>
                  {i > 0 && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        const updated = [...newQuotation.Commodities];
                        updated.splice(i, 1);
                        setNewQuotation({
                          ...newQuotation,
                          Commodities: updated,
                        });
                      }}
                    >
                      ❌ Remove
                    </button>
                  )}
                </div>

                {/* Inputs */}
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label fw-medium">Commodity</label>
                    <select
                      className="form-select"
                      value={c.name}
                      onChange={(e) =>
                        handleCommodityChange(i, "name", e.target.value)
                      }
                    >
                      <option value="">Select Commodity</option>
                      <option>Item A</option>
                      <option>Item B</option>
                      <option>Item C</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-medium">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={c.price}
                      onChange={(e) =>
                        handleCommodityChange(
                          i,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                    <div className="form-text">Per unit</div>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-medium">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={c.quantity}
                      onChange={(e) =>
                        handleCommodityChange(
                          i,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-medium">Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="pcs, kg..."
                      value={c.unit}
                      onChange={(e) =>
                        handleCommodityChange(i, "unit", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Optional"
                      value={c.description}
                      onChange={(e) =>
                        handleCommodityChange(i, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}

            <Button className="p-2 mb-2" size="" variant="secondary" onClick={addCommodity}>
              + Add Commodity
            </Button>
            {/* Discount Section */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">Discount Type</label>
                <select
                  className="form-select"
                  value={newQuotation.DiscountType}
                  onChange={(e) =>
                    setNewQuotation({
                      ...newQuotation,
                      DiscountType: e.target.value,
                    })
                  }
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Discount Value</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={newQuotation.DiscountValue}
                  onChange={(e) =>
                    setNewQuotation({
                      ...newQuotation,
                      DiscountValue: e.target.value,
                    })
                  }
                />
                <div className="form-text">
                  {newQuotation.DiscountType === "fixed"
                    ? "Enter discount amount in currency"
                    : "Enter discount percentage"}
                </div>
              </div>
            </div>

            {/* Grand Total */}
            <div className="alert alert-light border mt-4 text-center">
              <h4 className="fw-bold">
                Grand Total:{" "}
                <span className="text-success">{newQuotation.GrandTotal}</span>
              </h4>
            </div>

            <hr />
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Type</Form.Label>
                  <Form.Select
                    value={newQuotation.DiscountType}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        DiscountType: e.target.value,
                      })
                    }
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="percentage">Percentage</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Value</Form.Label>
                  <Form.Control
                    type="number"
                    value={newQuotation.DiscountValue}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        DiscountValue: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date Booked</Form.Label>
                  <Form.Control
                    type="date"
                    value={newQuotation.DateBooked}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        DateBooked: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Booked</Form.Label>
                  <Form.Control
                    type="time"
                    value={newQuotation.TimeBooked}
                    onChange={(e) =>
                      setNewQuotation({
                        ...newQuotation,
                        TimeBooked: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5>Grand Total: {newQuotation.GrandTotal}</h5>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newQuotation.Status}
                onChange={(e) =>
                  setNewQuotation({ ...newQuotation, Status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateQuotation}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
