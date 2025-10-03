import React, { useState } from "react";
import { Table, Button, Form, Row, Col, Card, InputGroup } from "react-bootstrap";
import { Search } from "lucide-react";
import "./enquiries.css";

const SEED = [
  { name: "Rohit", email: "iamrohitk1299@gmail.com", mobile: "9923212476", service: "Flats Cleaning", submittedOn: "18 August 2025 at 04:00 AM" },
  { name: "Rohan bhandare", email: "rohanbh1171@gmail.com", mobile: "9511681110", service: "Flats Cleaning", submittedOn: "05 August 2025 at 08:20 AM" },
  { name: "Rohan bhandare", email: "rohanbhandare555@gmail.com", mobile: "8789789797", service: "Offices Cleaning", submittedOn: "16 June 2025 at 09:21 AM" },
  { name: "LeeBaw", email: "zekisuquc419@gmail.com", mobile: "9511328622", service: "Car Wash", submittedOn: "31 May 2025 at 12:10 AM" },
  { name: "Joanna Riggs", email: "joannariggs278@gmail.com", mobile: "3704762807", service: "Custom Home Cleaning", submittedOn: "30 May 2025 at 09:45 PM" },
];

export default function Enquiries() {
  const [rows, setRows] = useState(SEED);
  const [search, setSearch] = useState("");

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.mobile.includes(search)
  );

  const onDelete = (email) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      setRows((prev) => prev.filter((r) => r.email !== email));
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Mobile", "Service", "Submitted On"];
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [r.name, r.email, r.mobile, r.service, r.submittedOn].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 enquiries-page">
      <Card className="shadow-sm border-0">
        <Card.Header className="enquiries-header text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-black">Contact Enquiries</h4>
          <div>
            <Button variant="light" className="me-2">Export to Excel</Button>
            <Button variant="info" onClick={exportCSV}>Export to CSV</Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Search */}
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-light"><Search size={16}/></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email or mobile"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Table */}
          <Table striped hover responsive className="align-middle enquiry-table mb-0">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Service</th>
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.mobile}</td>
                    <td>{r.service}</td>
                    <td>{r.submittedOn}</td>
                    <td>
                      <Button variant="success" size="sm" className="me-2">View</Button>
                      <Button variant="danger" size="sm" onClick={() => onDelete(r.email)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">No enquiries found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
