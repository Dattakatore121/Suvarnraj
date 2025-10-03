import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Table, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

const ShippingPage = () => {
  const navigate = useNavigate();

  const [areas, setAreas] = useState([]);
  const [cityOptions, setCityOptions] = useState(["Add New City"]);
  const [newArea, setNewArea] = useState("");
  const [amount, setAmount] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isAddingNewCity, setIsAddingNewCity] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [error, setError] = useState("");

  // ✅ Load from API when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get("http://localhost:3000/shipping");
        setAreas(res.data);
        setCityOptions([...res.data.map((a) => a.name), "Add New City"]);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
    fetchData();
  }, []);

  // ✅ Create / Update
  const handleCreate = async () => {
    setError("");
    const finalCity = newArea || newCityName;

    if (!finalCity.trim()) {
      setError("⚠️ Please select or add a city.");
      return;
    }
    if (!amount || parseInt(amount) <= 0) {
      setError("⚠️ Amount must be greater than 0.");
      return;
    }

    if (editId) {
      // update existing
      const updatedAreas = areas.map((a) =>
        a.id === editId ? { ...a, name: finalCity, amount: parseInt(amount) } : a
      );
      setAreas(updatedAreas);

      try {
        await axios.put(`http://localhost:3000/shipping/${editId}`, {
          name: finalCity,
          amount: parseInt(amount),
        });
        alert(`✅ City "${finalCity}" updated successfully!`);
      } catch (err) {
        console.error("Update error:", err.message);
      }

      setEditId(null);
    } else {
      // create new
      if (areas.some((a) => a.name.toLowerCase() === finalCity.toLowerCase())) {
        setError("⚠️ This city is already added.");
        return;
      }

      const newCity = {
        id: areas.length + 1,
        name: finalCity,
        amount: parseInt(amount),
      };

      setAreas([...areas, newCity]);

      try {
        await axios.post("http://localhost:3000/shipping", newCity);
        alert(`🎉 City "${finalCity}" added successfully!`);
      } catch (err) {
        console.error("Add error:", err.message);
      }

      setCityOptions([...cityOptions.slice(0, -1), finalCity, "Add New City"]);
    }

    setNewArea("");
    setAmount("");
    setNewCityName("");
    setIsAddingNewCity(false);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    const deletedCity = areas.find((a) => a.id === id)?.name;
    setAreas(areas.filter((a) => a.id !== id));
    try {
      await axios.delete(`http://localhost:3000/shipping/${id}`);
      alert(`🗑️ City "${deletedCity}" deleted successfully!`);
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  // Edit
  const handleEdit = (area) => {
    setNewArea(area.name);
    setAmount(area.amount);
    setEditId(area.id);
  };

  // City dropdown change
  const handleCityChange = (value) => {
    if (value === "Add New City") {
      setIsAddingNewCity(true);
      setNewArea("");
    } else {
      setIsAddingNewCity(false);
      setNewArea(value);
    }
  };

  // Search filter
  const filteredAreas = areas.filter(
    (a) =>
      a.id.toString().includes(search) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.amount.toString().includes(search)
  );

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📦 Shipping Management</h2>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Form Card */}
      <Card className="shadow-sm bg-white mb-4 border-0 rounded-4 p-4">
        <h5 className="fw-bold mb-3 text-black">Add / Update Area</h5>
        <Row className="g-3 align-items-center">
          <Col md={4}>
            <Form.Select
              value={newArea}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">Select a City Area</option>
              {cityOptions.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </Form.Select>
          </Col>

          {isAddingNewCity && (
            <Col md={4} className="d-flex gap-2">
              <Form.Control
                placeholder="Enter New City Name"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
              />
              <Button variant="success" onClick={handleCreate}>
                Save
              </Button>
            </Col>
          )}

          <Col md={3}>
            <Form.Control
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Col>

          <Col md={2}>
            <Button
              className="w-100 btn-warning"
              variant={editId ? "success" : "primary"}
              onClick={handleCreate}
            >
              {editId ? "Update" : "Create"}
            </Button>
          </Col>
        </Row>
        {error && <p className="text-danger mt-2">{error}</p>}
      </Card>

      {/* Search Input */}
      <Card className="shadow-sm mb-3 border-0 rounded-4 p-3">
        <Form.Control
          type="text"
          placeholder="Search by ID, Name, or Amount"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {/* Areas Table */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAreas.length > 0 ? (
                filteredAreas.map((area) => (
                  <motion.tr
                    key={area.id}
                    whileHover={{ scale: 1.001, backgroundColor: "#f8fafc" }}
                  >
                    <td>{area.id}</td>
                    <td>{area.name}</td>
                    <td>₹{area.amount}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleEdit(area)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(area.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-muted">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ShippingPage;