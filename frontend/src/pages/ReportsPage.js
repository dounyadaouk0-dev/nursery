import { useEffect, useState } from "react";
import { getReports, deleteReport } from "../api/api";

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterChild, setFilterChild] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    getReports()
      .then(res => {
        setReports(res);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this report?")) {
      deleteReport(id)
        .then(() => {
          loadReports();
        })
        .catch(err => alert("Error deleting report"));
    }
  };
  const childrenNames = [...new Set(reports.map(r => r.name))].sort();
  const filteredReports = filterChild
    ? reports.filter(r => r.name === filterChild)
    : reports;

  return (
    <div className="page-wrapper">
      <h2> All Daily Reports</h2>

      {loading && (
        <div className="empty-state">
          <div className="loading"></div>
          <p>Loading reports...</p>
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <p> No reports yet</p>
          </div>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <>
          {/* Filter */}
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
              Filter by Child:
            </label>
            <select
              value={filterChild}
              onChange={e => setFilterChild(e.target.value)}
              style={{ maxWidth: "300px" }}
            >
              <option value="">-- All Children --</option>
              {childrenNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Reports Table */}
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Child</th>
                  <th>Meal</th>
                  <th>Sleep (hrs)</th>
                  <th>Mood</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report.id}>
                    <td>{new Date(report.date).toLocaleDateString()}</td>
                    <td><strong>{report.name}</strong></td>
                    <td>{report.meal || "-"}</td>
                    <td>{report.sleep_hours || "-"}</td>
                    <td>
                      <span className="badge badge-primary">
                        {report.mood || "Not specified"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="btn btn-danger btn-small"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="empty-state">
              <p>No reports found for {filterChild}</p>
            </div>
          )}

          {/* Summary */}
          <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <h4>Total Reports</h4>
              <p style={{ fontSize: "2rem", color: "#667eea" }}>{filteredReports.length}</p>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <h4>Average Sleep</h4>
              <p style={{ fontSize: "2rem", color: "#667eea" }}>
                {filteredReports.length > 0
                  ? (filteredReports.reduce((sum, r) => sum + (parseFloat(r.sleep_hours) || 0), 0) / filteredReports.length).toFixed(1)
                  : "0"}
                h
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportsPage;
