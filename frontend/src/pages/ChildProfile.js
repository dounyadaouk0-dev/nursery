import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getChild, getReportsByChild, getAttendanceByChild, deleteChild, updateChild } from "../api/api";

const allergyMap = {
  Blueberry: "Peanuts",
  "Rose Berry": "Milk",
  BlackBerry: "Soy",
  default: "No known allergies"
};

function ChildProfile() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [reports, setReports] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingClass, setEditingClass] = useState(false);
  const [newClass, setNewClass] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadChildData();
  }, [id]);

  const loadChildData = async () => {
    setLoading(true);
    try {
      const childData = await getChild(id);
      setChild(childData);
      setNewClass(childData?.class || "");
      
      if (childData) {
        const reportsData = await getReportsByChild(id);
        const attendanceData = await getAttendanceByChild(id);
        setReports(reportsData);
        setAttendance(attendanceData);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${child.name}?`)) {
      deleteChild(id).then(() => {
        alert("Child deleted successfully");
        window.location.href = "/home";
      }).catch(err => alert("Error deleting child"));
    }
  };

  const handleSaveClass = async () => {
    if (!newClass) {
      alert("Please select a class");
      return;
    }
    setUpdating(true);
    try {
      await updateChild(id, { 
        name: child.name, 
        age: child.age, 
        className: newClass 
      });
      setChild({ ...child, class: newClass });
      setEditingClass(false);
      alert("Class updated successfully!");
    } catch (err) {
      alert("Error updating class: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="page-wrapper">
        <h2>Child Not Found</h2>
        <p>The child with ID {id} was not found.</p>
        <Link to="/home" className="btn btn-secondary">← Back to Home</Link>
      </div>
    );
  }

  const allergies = allergyMap[child.class] || allergyMap.default;

  const imageUrl = child.image
    ? child.image.startsWith("http") || child.image.startsWith("data:")
      ? child.image
      : child.image.startsWith("/uploads")
        ? `http://berrynursery.atwebpages.com${child.image}`
        : `http://berrynursery.atwebpages.com/uploads/${child.image}`
    : `https://via.placeholder.com/200?text=${encodeURIComponent(child.name)}`;

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: "30px" }}>
        <Link to="/home" className="btn btn-secondary">← Back to Home</Link>
      </div>

      {/* Header */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
          <img
            src={imageUrl}
            alt={`${child.name} profile`}
            style={{ borderRadius: "16px", objectFit: "cover", objectPosition: "center center", width: "200px", height: "200px" }}
            onError={(e) => { e.target.src = `https://via.placeholder.com/200?text=${encodeURIComponent(child.name)}`; }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <h1 style={{ margin: 0 }}>{child.name}</h1>
              <span className="badge badge-primary">{child.class}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              <div>
                <p><strong>Age:</strong> {child.age} years</p>
                <p>
                  <strong>Class:</strong> 
                  {editingClass ? (
                    <div style={{ marginTop: "10px" }}>
                      <select 
                        value={newClass} 
                        onChange={e => setNewClass(e.target.value)}
                        style={{ padding: "8px", marginRight: "10px" }}
                      >
                        <option value="">Select Class</option>
                        <option value="Blueberry">Blueberry</option>
                        <option value="Rose Berry">Rose Berry</option>
                        <option value="BlackBerry">BlackBerry</option>
                      </select>
                      <button 
                        onClick={handleSaveClass}
                        disabled={updating}
                        className="btn btn-primary"
                        style={{ padding: "8px 16px", fontSize: "12px", marginRight: "5px" }}
                      >
                        {updating ? "Saving..." : "Save"}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingClass(false);
                          setNewClass(child.class || "");
                        }}
                        className="btn btn-secondary"
                        style={{ padding: "8px 16px", fontSize: "12px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: "5px" }}>
                      <span>{child.class || "Not assigned"}</span>
                      <button 
                        onClick={() => setEditingClass(true)}
                        className="btn btn-secondary"
                        style={{ padding: "4px 12px", fontSize: "12px", marginLeft: "10px" }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </p>
              </div>
              <div>
                <p><strong>ID:</strong> #{child.id}</p>
                <p><strong>Allergies:</strong> {allergies}</p>
              </div>
            </div>
            <button 
              className="btn btn-danger" 
              style={{ marginTop: "20px" }}
              onClick={handleDelete}
            >
              Delete Child
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: "30px", display: "flex", gap: "10px", borderBottom: "2px solid #e0e0e0", paddingBottom: "10px" }}>
        <button
          className={activeTab === "overview" ? "btn btn-primary" : "btn btn-secondary"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "reports" ? "btn btn-primary" : "btn btn-secondary"}
          onClick={() => setActiveTab("reports")}
        >
          Reports ({reports.length})
        </button>
        <button
          className={activeTab === "attendance" ? "btn btn-primary" : "btn btn-secondary"}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance ({attendance.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="card">
          <h3>Child Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            <div>
              <h4>Statistics</h4>
              <p>Total Reports: <strong>{reports.length}</strong></p>
              <p>Attendance Records: <strong>{attendance.length}</strong></p>
            </div>
            <div>
              <h4>Class Information</h4>
              <p>Class: <strong>{child.class}</strong></p>
              <p>Age Group: <strong>{child.age} years</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div>
          {reports.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <p>No reports yet for {child.name}</p>
                <Link to="/add-report" className="btn btn-primary" style={{ marginTop: "20px" }}>
                  Add Report
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {reports.map(report => (
                <div key={report.id} className="card">
                  <div className="card-header">
                    <div>
                      <strong>{new Date(report.date).toLocaleDateString()}</strong>
                      <span style={{ marginLeft: "10px" }} className="badge badge-primary">{report.mood || "Neutral"}</span>
                    </div>
                  </div>
                  <div className="card-content">
                    {report.meal && <p><strong>Meal:</strong> {report.meal}</p>}
                    {report.sleep_hours && <p><strong>Sleep:</strong> {report.sleep_hours} hours</p>}
                    {report.mood && <p><strong>Mood:</strong> {report.mood}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div>
          {attendance.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <p>No attendance records yet</p>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map(record => (
                    <tr key={record.id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.check_in || "-"}</td>
                      <td>{record.check_out || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChildProfile;