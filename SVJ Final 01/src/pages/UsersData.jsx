import React, { useState, useMemo } from "react";
import { Table, Button, InputGroup, Form, Card, Modal } from "react-bootstrap";
import { Search } from "lucide-react";
import "./usersdata.css";
import { div } from "framer-motion/client";

function UsersData({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const recordsPerPage = 5;

  // Filtered data based on search
  const filteredData = useMemo(() => {
    const s = search.trim().toLowerCase();
    return data.filter(
      (user) =>
        user.id.toString().includes(s) ||
        user.name.toLowerCase().includes(s) ||
        user.email.toLowerCase().includes(s)
    );
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div>
      <div>
        <Card className="shadow-sm border-0 my-3">
          <Card.Header className="bg-white text-white d-flex justify-content-between align-items-center">
            <h4 className="mb-0 text-black">Registered Users</h4>
            <InputGroup className="w-25">
              <InputGroup.Text className="bg-white border-0">
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search by ID, Name or Email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </InputGroup>
          </Card.Header>
          <Card.Body>
            <Table
              striped
              hover
              responsive
              className="align-middle users-table mb-0"
            >
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((user, index) => (
                    <tr key={index}>
                      <td>{user.id}</td>
                      <td className="fw-bold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className="d-flex align-items-center gap-1"
                          onClick={() => handleView(user)}
                        >
                          <i className="ri-eye-line"></i> View
                          
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav>
                <ul className="pagination justify-content-center mt-3">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </Card.Body>
        </Card>
      </div>
      <div>
        {/* View Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enquiry Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <div>
                <p>
                  <strong>ID:</strong> {selectedUser.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedUser.phone}
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default UsersData;
