import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar() {
  const [flatEvents, setFlatEvents] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [blockType, setBlockType] = useState("Flats Only");
  const [activeTab, setActiveTab] = useState("flats");

  // Add event
  const handleBlockDate = () => {
    if (!date || !reason) {
      alert("Please fill all fields");
      return;
    }

    // ✅ Check limit: max 2 events allowed per calendar type
    if (
      (blockType === "Flats Only" && flatEvents.length >= 2) ||
      (blockType === "Custom Cleaning" && customEvents.length >= 2)
    ) {
      alert("You can only add up to 2 reasons for this calendar type!");
      return;
    }

    const newEvent = {
      title: reason,
      start: date,
      allDay: true, // ensures the whole day is blocked
      color: blockType === "Flats Only" ? "red" : "blue", // red/blue
      textColor: "white",
    };

    if (blockType === "Flats Only") {
      setFlatEvents([...flatEvents, newEvent]);
    } else {
      setCustomEvents([...customEvents, newEvent]);
    }

    setDate("");
    setReason("");
  };

  // Delete event
  const handleEventClick = (info) => {
    if (window.confirm("Delete this event?")) {
      if (activeTab === "flats") {
        setFlatEvents(
          flatEvents.filter((e) => e.start !== info.event.startStr)
        );
      } else {
        setCustomEvents(
          customEvents.filter((e) => e.start !== info.event.startStr)
        );
      }
    }
  };

  return (
    <div className="p-4" style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center p-3 rounded shadow mb-4">
        <h4 className="fw-bold m-0">
          <i className="ri-calendar-2-line me-2"></i> Calendar Management
        </h4>
        <span className="fw-light">Manage booking blocks easily</span>
      </div>

      <div className="row">
        {/* Left Panel (Form) */}
        <div className="col-md-4">
          <div
            className="card shadow border-0 mb-4"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body">
              <h6 className="fw-bold mb-3">Calendar Type</h6>

              {/* Tabs */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link fw-semibold ${
                      activeTab === "flats" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("flats")}
                  >
                    Flats
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link fw-semibold ${
                      activeTab === "custom" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("custom")}
                  >
                    Custom Cleaning
                  </button>
                </li>
              </ul>

              {/* Form */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  min={new Date().toISOString().split("T")[0]} // ✅ today onwards
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Reason</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Block Type</label>
                <select
                  className="form-select"
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value)}
                >
                  <option>Flats Only</option>
                  <option>Custom Cleaning</option>
                 
                </select>
              </div>

              <button
                className="btn btn-primary fw-bold w-100"
                style={{ borderRadius: "8px" }}
                onClick={handleBlockDate}
              >
                Block Date
              </button>

              {/* Legends */}
              <div className="mt-4">
                <h6 className="fw-bold mb-2">Legends</h6>
                <div className="d-flex flex-column gap-2">
                  <span>
                    <span className="badge bg-danger me-2">&nbsp;</span>
                    Admin Blocked (Flats)
                  </span>
                  <span>
                    <span className="badge bg-primary me-2">&nbsp;</span>
                    Admin Blocked (Custom Cleaning)
                  </span>
                  <span>
                    <span className="badge bg-warning text-dark me-2">
                      &nbsp;
                    </span>
                    Admin Blocked (Booked by Customer)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (Calendar) */}
        <div className="col-md-8">
          <div
            className="card shadow border-0"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                editable={true}
                selectable={true}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={activeTab === "flats" ? flatEvents : customEvents}
                eventClick={handleEventClick}
                height="70vh"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}