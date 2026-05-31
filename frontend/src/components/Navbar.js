import { Link, useNavigate } from "react-router-dom";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };  

  return (
    <nav>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <h1 style={{ margin: "0 0 15px 0" }}>Berries Nursery</h1>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {!isAuthenticated && <Link to="/login">Login</Link>}
          {isAuthenticated && (
            <>
              <Link to="/home">Home</Link>
              <Link to="/add-child">Add Child</Link>
              <Link to="/add-report">Add Report</Link>
              <Link to="/reports">Reports</Link>
              <Link to="/attendance">Attendance</Link>
              <Link to="/all-attendance">View Attendance</Link>
              <Link to="/classes">Classes</Link>
              <Link to="/admin">Admin</Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
