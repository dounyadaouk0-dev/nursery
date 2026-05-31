import { useEffect, useState } from "react";
import { getChildren, getAttendance, getReports, addAttendance } from "../api/api";

function AdminDashboard() {
  const [children, setChildren] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [reports, setReports] = useState([]);
  const [childId, setChildId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    getChildren().then(res => setChildren(res)).catch(err => console.log(err));
    getAttendance().then(res => setAttendance(res)).catch(err => console.log(err));
    getReports().then(res => setReports(res)).catch(err => console.log(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!childId || !date) {
      setMessage(" Please select a child and date");
      return;
    }

    setLoading(true);
    try {
      await addAttendance({ child_id: childId, check_in: checkIn, check_out: checkOut, date });
      setMessage(" Attendance saved successfully!");
      setChildId("");
      setCheckIn("");
      setCheckOut("");
      setDate(new Date().toISOString().split('T')[0]);
      loadDashboardData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(" Error saving attendance");
    } finally {
      setLoading(false);
    }
  };
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter(record => record.date === today);
  const presentToday = todayRecords.length;
  const totalChildren = children.length;
  const absentToday = totalChildren - presentToday;
  const classStats = {
    Blueberry: children.filter(c => c.class === "Blueberry").length,
    "Rose Berry": children.filter(c => c.class === "Rose Berry").length,
    BlackBerry: children.filter(c => c.class === "BlackBerry").length
  };

  return (
    <div className="page-wrapper">
      <h2>️ Admin Dashboard</h2>

      {message && (
        <div className={`alert ${message.includes('') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-3" style={{ marginBottom: "40px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>‍‍‍ Total Children</h3>
          <p style={{ fontSize: "2.5rem", margin: "10px 0", color: "#667eea" }}>{totalChildren}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0" }}> Present Today</h3>
          <p style={{ fontSize: "2.5rem", margin: "10px 0", color: "#28a745" }}>{presentToday}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0" }}> Absent Today</h3>
          <p style={{ fontSize: "2.5rem", margin: "10px 0", color: "#dc3545" }}>{absentToday}</p>
        </div>
      </div>

      {/* Class Overview */}
      <div style={{ marginBottom: "40px" }}>
        <h3> Class Statistics</h3>
        <div className="grid grid-3">
          {Object.entries(classStats).map(([className, count]) => (
            <div key={className} className="card">
              <h4>{className}</h4>
              <p style={{ fontSize: "2rem", color: "#667eea" }}>{count} children</p>
              <p style={{ color: "#999", fontSize: "0.9rem" }}>assigned to this class</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Attendance Form */}
        <div className="card">
          <h3> Record Attendance</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Child *</label>
              <select 
                value={childId}
                onChange={e => setChildId(e.target.value)}
                required
              >
                <option value="">-- Select a child --</option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>{child.name} ({child.class})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Check In Time</label>
              <input 
                type="time"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Check Out Time</label>
              <input 
                type="time"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </form>
        </div>

        {/* Today's Attendance */}
        <div className="card">
          <h3> Today's Attendance ({todayRecords.length}/{totalChildren})</h3>
          {todayRecords.length === 0 ? (
            <div className="empty-state">
              <p>No attendance recorded for today</p>
            </div>
          ) : (
            <div style={{ overflowY: "auto", maxHeight: "400px" }}>
              {todayRecords.map(record => (
                <div key={record.id} style={{ padding: "10px", borderBottom: "1px solid #e0e0e0" }}>
                  <p><strong>{record.name}</strong></p>
                  <p style={{ fontSize: "0.9rem", color: "#666" }}>
                    In: {record.check_in || "-"} | Out: {record.check_out || "-"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Reports */}
      <div style={{ marginTop: "40px" }}>
        <h3> Recent Reports</h3>
        {reports.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <p>No reports yet</p>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Child</th>
                  <th>Meal</th>
                  <th>Sleep</th>
                  <th>Mood</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 15).map(report => (
                  <tr key={report.id}>
                    <td>{new Date(report.date).toLocaleDateString()}</td>
                    <td><strong>{report.name}</strong></td>
                    <td>{report.meal || "-"}</td>
                    <td>{report.sleep_hours ? `${report.sleep_hours}h` : "-"}</td>
                    <td><span className="badge badge-primary">{report.mood || "Neutral"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
