import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

function Contact() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = "http://localhost:3000/enquiredUsers";

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setAllData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Search
  const handleSearch = () => {
    const lower = search.toLowerCase();
    const results = allData.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.mobile.includes(lower)
    );
    setFilteredData(results);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setFilteredData(allData);
    setCurrentPage(1);
  };

  // Export
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, "contacts.xlsx");
  };

  // Delete (frontend + backend)
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${API_URL}/${userId}`);
      const updated = allData.filter((u) => u.id !== userId);
      setAllData(updated);
      setFilteredData(updated);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Copy
  const handleCopy = (user) => {
    const textToCopy = `Name: ${user.name}, Email: ${user.email}, Mobile: ${user.mobile}`;
    navigator.clipboard.writeText(textToCopy);
    alert("Copied to clipboard!");
  };

  // View
  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="p-3">
      <h2>Contact Enquiries</h2>

      {/* Search */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="search"
          placeholder="Search by name, email or mobile"
          className="form-control w-75"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="d-flex gap-2">
          <button className="btn btn-info text-white fw-bold" onClick={handleSearch}>
            Search
          </button>
          <button
            className="btn text-white fw-bold"
            style={{ backgroundColor: "#7d7575" }}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-success fw-bold" onClick={exportToExcel}>
          Export To Excel
        </button>
      </div>

      {/* Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="bg-black text-white">Name</th>
            <th className="bg-black text-white">Email</th>
            <th className="bg-black text-white">Mobile</th>
            <th className="bg-black text-white">Service</th>
            <th className="bg-black text-white">Submitted on</th>
            <th className="bg-black text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.service}</td>
              <td>{new Date(user.submittedOn).toLocaleString()}</td>
              <td className="d-flex gap-2">
                <button className="btn btn-success" onClick={() => handleView(user)}>
                  View
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
                <button className="btn btn-outline-warning" onClick={() => handleCopy(user)}>
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enquiry Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
              <p><strong>Service:</strong> {selectedUser.service}</p>
              <p><strong>Submitted On:</strong> {new Date(selectedUser.submittedOn).toLocaleString()}</p>
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
  );
}

export default Contact;
