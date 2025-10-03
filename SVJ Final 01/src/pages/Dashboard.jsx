import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Table, ProgressBar } from "react-bootstrap";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// Top summary cards
function DashboardCards({ navigator }) {
  const cards = [
    {
      title: "Website Orders",
      count: 129,
      icon: "ri-shopping-cart-2-line",
      bg: "linear-gradient(135deg,#bae6fd,#0284c7)",
      onClick: () => navigator("/ordersList"),
    },
    {
      title: "Staff Orders",
      count: 21,
      icon: "ri-user-settings-line",
      bg: "linear-gradient(135deg,#ffd8a8,#f97316)",
      onClick: () => navigator("/quot-orders"),
    },
    {
      title: "Registered Users",
      count: 11,
      icon: "ri-user-add-line",
      bg: "linear-gradient(135deg,#a7f3d0,#0d9488)",
      onClick: () => navigator("/registered-users"),
    },
  ];

  return (
    <Row className="g-4 mb-4">
      {cards.map((card, idx) => (
        <Col md={4} key={idx}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card
              className="shadow-lg border-0 text-center"
              style={{
                borderRadius: "15px",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={card.onClick}
            >
              <Card.Body>
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div
                    className="p-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      background: card.bg,
                      color: "#fff",
                      fontSize: "1.8rem",
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <i className={card.icon}></i>
                  </div>
                  <div className="text-start">
                    <motion.h4
                      className="fw-bold mb-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                    >
                      {card.count}
                    </motion.h4>
                    <p className="text-muted mb-0">{card.title}</p>
                  </div>
                </div>
                <motion.div
                  className="fw-bold mt-3 text-primary"
                  whileHover={{ x: 5 }}
                  style={{ cursor: "pointer", fontWeight: "600" }}
                  onClick={card.onClick}
                >
                  More Info →
                </motion.div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
}

function Dashboard() {
  const navigator = useNavigate();

  // Sample data for charts
  const barData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Website Orders",
        data: [25, 40, 30, 34],
        backgroundColor: "#0284c7",
        borderRadius: 5,
      },
      {
        label: "Staff Orders",
        data: [10, 14, 12, 9],
        backgroundColor: "#f97316",
        borderRadius: 5,
      },
    ],
  };

  const lineData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [200, 450, 300, 500, 400, 650, 700],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="p-3" style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center p-3 rounded shadow mb-4"
        /* style={{
          background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
          color: "white",
        }} */
      >
        <h3 className="fw-bold m-0 d-flex align-items-center gap-2">
          <i className="ri-dashboard-line"></i> Dashboard Overview
        </h3>
        <p className="m-0 fw-light">Snapshot of business performance</p>
      </div>

      {/* Top Cards */}
      <DashboardCards navigator={navigator} />

      {/* Sales Graph Section */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Card className="shadow border-0 mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body>
                <Card.Title className="fw-bold">📊 Orders Trend (Last 4 Weeks)</Card.Title>
                <Bar data={barData} options={chartOptions} height={250} />
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={6}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <Card className="shadow border-0 mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body>
                <Card.Title className="fw-bold">💰 Revenue Trend (Last 7 Days)</Card.Title>
                <Line data={lineData} options={chartOptions} height={250} />
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Card className="shadow border-0 mb-4" style={{ borderRadius: "15px" }}>
        <Card.Body>
          <Card.Title className="fw-bold">🛒 Recent Orders</Card.Title>
          <Table hover responsive className="align-middle mt-3">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "#101", name: "Rahul Patil", status: "Delivered", statusClass: "success", amount: "₹250", date: "2025-09-08" },
                { id: "#102", name: "Anjali More", status: "Processing", statusClass: "warning", amount: "₹180", date: "2025-09-08" },
                { id: "#103", name: "Prakash Jadhav", status: "Cancelled", statusClass: "danger", amount: "₹120", date: "2025-09-07" },
              ].map((order, idx) => (
                <motion.tr key={idx} whileHover={{ scale: 1.001, backgroundColor: "#f8fafc" }}>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>
                    <span className={`badge bg-${order.statusClass}`}>{order.status}</span>
                  </td>
                  <td>{order.amount}</td>
                  <td>{order.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;
