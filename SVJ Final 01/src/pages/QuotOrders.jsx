import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  InputGroup,
  Form,
  Button,
  Badge,
  Modal,
  Pagination,
} from "react-bootstrap";
import { Search } from "lucide-react";
import axios from "axios";

function QuotOrders() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState([]);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const API_URL = "http://localhost:3000/quotConvertedOrders";

  const getOrders = async () => {
    try {
      let response = await axios.get(API_URL);
      setOrders(response.data);
    } catch (error) {
      console.log("Error: ", error.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // ✅ Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const customer = o.customer || "";
    const quotationId = o.quotationId || "";

    return (
      customer.toLowerCase().includes(search.toLowerCase()) ||
      quotationId.toLowerCase().includes(search.toLowerCase())
    );
  });

  // ✅ Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleView = (order) => {
    setModalData(order);
    setEditMode(false);
    setShowModal(true);
  };

  const handleQuote = (order) => {
    alert(`Open quotation details for ${order.quotationId}`);
  };

  const handleEdit = (order) => {
    setModalData(order);
    setEditMode(true);
    setShowModal(true);
  };

  const handleInvoice = (order) => {
    const csvContent = `Order ID,Quotation ID,Customer,Order Status,Payment Status,Grand Total\n${order.id},${order.quotationId},${order.customer},${order.orderStatus},${order.paymentStatus},${order.grandTotal}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${order.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedOrder = {
      ...modalData,
      customer: form.customer.value,
      orderStatus: form.orderStatus.value,
      paymentStatus: form.paymentStatus.value,
      grandTotal: form.grandTotal.value,
    };

    try {
      await axios.put(`${API_URL}/${modalData.id}`, updatedOrder);

      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );

      setShowModal(false);
    } catch (error) {
      console.log("Update Error:", error.message);
    }
  };

  return (
    <Card className="shadow-sm border-0 my-4">
      <Card.Header className="bg-white text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0 text-black">
          <i className="ri-align-justify pe-2"></i> Quotation Converted Orders
        </h4>

        <InputGroup className="w-50">
          <InputGroup.Text className="bg-white border-0">
            <Search size={16} />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search by customer or quotation ID"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
          />
          <Button variant="success">Search</Button>
        </InputGroup>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="table-responsive p-3">
          <Table hover className="mb-0 align-middle">
            <thead className="table-dark">
              <tr style={{ fontSize: "13px" }}>
                <th>ORDER ID</th>
                <th>QUOTATION ID</th>
                <th>CUSTOMER NAME</th>
                <th>ORDER STATUS</th>
                <th>PAYMENT STATUS</th>
                <th>GRAND TOTAL</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <a href="#" className="text-primary fw-bold">
                        #{order.id}
                      </a>
                    </td>
                    <td>
                      <Badge bg="light" text="dark">
                        {order.quotationId}
                      </Badge>
                    </td>
                    <td>{order.customer}</td>
                    <td>
                      <Badge
                        bg={
                          order.orderStatus === "Pending"
                            ? "warning"
                            : order.orderStatus === "Rejected"
                            ? "danger"
                            : "primary"
                        }
                        text={
                          order.orderStatus === "Pending" ||
                          order.orderStatus === "Rejected"
                            ? "dark"
                            : ""
                        }
                      >
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg={
                          order.paymentStatus === "Paid"
                            ? "success"
                            : order.paymentStatus === "Partially Paid"
                            ? "warning"
                            : "danger"
                        }
                        text={
                          order.paymentStatus === "Partially Paid" ? "dark" : ""
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="fw-bold text-success">
                      ₹{order.grandTotal}
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleInvoice(order)}
                        >
                          Invoice
                        </Button>
                        <Button
                          variant="info"
                          size="sm"
                          className="text-white"
                          onClick={() => handleView(order)}
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuote(order)}
                        >
                          Quote
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* ✅ Pagination Component */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
              />
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              />
              <Pagination.Last
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              />
            </Pagination>
          </div>
        )}
      </Card.Body>

      {/* Modal for View/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit Order" : "Order Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && !editMode && (
            <div>
              <p>
                <strong>Order ID:</strong> #{modalData.id}
              </p>
              <p>
                <strong>Quotation ID:</strong> {modalData.quotationId}
              </p>
              <p>
                <strong>Customer:</strong> {modalData.customer}
              </p>
              <p>
                <strong>Order Status:</strong> {modalData.orderStatus}
              </p>
              <p>
                <strong>Payment Status:</strong> {modalData.paymentStatus}
              </p>
              <p>
                <strong>Grand Total:</strong> ₹{modalData.grandTotal}
              </p>
            </div>
          )}

          {modalData && editMode && (
            <Form onSubmit={handleSaveEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  name="customer"
                  defaultValue={modalData.customer}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Order Status</Form.Label>
                <Form.Select
                  name="orderStatus"
                  defaultValue={modalData.orderStatus}
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Payment Status</Form.Label>
                <Form.Select
                  name="paymentStatus"
                  defaultValue={modalData.paymentStatus}
                >
                  <option>Not Paid</option>
                  <option>Partially Paid</option>
                  <option>Paid</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Grand Total</Form.Label>
                <Form.Control
                  name="grandTotal"
                  defaultValue={modalData.grandTotal}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default QuotOrders;
