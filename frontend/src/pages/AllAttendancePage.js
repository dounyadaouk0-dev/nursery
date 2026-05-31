import { useEffect, useState } from "react";
import { getAttendance, deleteAttendance } from "../api/api";

function AllAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterChild, setFilterChild] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = () => {
    getAttendance()
      .then(res => {
        setAttendance(res);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this attendance record?")) {
      deleteAttendance(id)
        .then(() => {
          loadAttendance();
        })
        .catch(err => alert("Error deleting record"));
    }
  };
  const childrenNames = [...new Set(attendance.map(r => r.name))].sort();
  const dates = [...new Set(attendance.map(r => r.date))].sort().reverse();

  let filteredAttendance = attendance;
  if (filterChild) {
    filteredAttendance = filteredAttendance.filter(r => r.name === filterChild);
  }
  if (filterDate) {
    filteredAttendance = filteredAttendance.filter(r => r.date === filterDate);
  }
  const totalRecords = filteredAttendance.length;
  const childrenPresent = [...new Set(filteredAttendance.filter(r => r.check_in).map(r => r.name))].length;

  return (
    <div className="page-wrapper">
      <h2> Attendance Records</h2>

      {loading && (
        <div className="empty-state">
          <div className="loading"></div>
          <p>Loading attendance records...</p>
        </div>
      )}

      {!loading && attendance.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <p> No attendance records yet</p>
          </div>
        </div>
      )}

      {!loading && attendance.length > 0 && (
        <>
          {/* Filters */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
                Filter by Child:
              </label>
              <select
                value={filterChild}
                onChange={e => setFilterChild(e.target.value)}
              >
                <option value="">-- All Children --</option>
                {childrenNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
                Filter by Date:
              </label>
              <select
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
              >
                <option value="">-- All Dates --</option>
                {dates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <h4>Total Records</h4>
              <p style={{ fontSize: "2.5rem", color: "#667eea", margin: "10px 0" }}>{totalRecords}</p>
              <p style={{ color: "#999", margin: 0 }}>matching filters</p>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <h4>Children Present</h4>
              <p style={{ fontSize: "2.5rem", color: "#28a745", margin: "10px 0" }}>{childrenPresent}</p>
              <p style={{ color: "#999", margin: 0 }}>with check-in recorded</p>
            </div>
          </div>

          {/* Records Table */}
          {filteredAttendance.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <p>No attendance records match your filters</p>
              </div>
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
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map(record => {
                    let duration = "-";
                    if (record.check_in && record.check_out) {
                      const [inH, inM] = record.check_in.split(":").map(Number);
                      const [outH, outM] = record.check_out.split(":").map(Number);
                      const inMinutes = inH * 60 + inM;
                      const outMinutes = outH * 60 + outM;
                      const durationMinutes = outMinutes - inMinutes;
                      duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
                    }

                    return (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td><strong>{record.name}</strong></td>
                        <td>
                          {record.check_in ? (
                            <span className="badge badge-success">{record.check_in}</span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {record.check_out ? (
                            <span className="badge badge-primary">{record.check_out}</span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{duration}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="btn btn-danger btn-small"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AllAttendancePage;
