import { useEffect, useState } from "react";
import { getChildren, addAttendance, getAttendance } from "../api/api";

function Attendance() {
  const [children, setChildren] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [child_id, setChildId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getChildren().then(res => setChildren(res)).catch(err => console.log(err));
    loadAttendance();
  }, []);

  const loadAttendance = () => {
    getAttendance()
      .then(res => setAttendanceRecords(res))
      .catch(err => console.log(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!child_id || !date) {
      setMessage("Please select a child and date");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      if (checkIn) {
        await addAttendance({ child_id, action: 'check_in', time: checkIn, date });
      }
      if (checkOut) {
        await addAttendance({ child_id, action: 'check_out', time: checkOut, date });
      }
      if (!checkIn && !checkOut) {
        setMessage("Please provide a check-in or check-out time.");
        setMessageType("error");
        return;
      }

      setMessage("Attendance saved successfully!");
      setMessageType("success");
      setChildId("");
      setCheckIn("");
      setCheckOut("");
      setDate(new Date().toISOString().split('T')[0]);
      loadAttendance();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error saving attendance");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const todayDate = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter(r => r.date === todayDate);

  return (
    <div className="page-wrapper">
      <h2> Attendance Management</h2>

      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Form Section */}
        <div>
          <h3>Record Attendance</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Child *</label>
              <select 
                value={child_id}
                onChange={e => setChildId(e.target.value)}
                required
              >
                <option value="">-- Select a child --</option>
                {children.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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

        {/* Records Section */}
        <div>
          <h3>Today's Attendance ({todayRecords.length})</h3>
          {todayRecords.length === 0 ? (
            <div className="empty-state">
              <p>No attendance records for today</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Child</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {todayRecords.map(record => (
                    <tr key={record.id}>
                      <td>{record.name}</td>
                      <td>{record.check_in || "-"}</td>
                      <td>{record.check_out || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* All Records */}
      <div style={{ marginTop: "40px" }}>
        <h3>All Attendance Records</h3>
        {attendanceRecords.length === 0 ? (
          <div className="empty-state">
            <p>No attendance records yet</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Child</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.slice(0, 20).map(record => (
                  <tr key={record.id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.name}</td>
                    <td>{record.check_in || "-"}</td>
                    <td>{record.check_out || "-"}</td>
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

export default Attendance;