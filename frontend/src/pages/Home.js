import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getChildren } from "../api/api";
import ChildCard from "../components/ChildCard";

function Home() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    getChildren()
      .then(res => {
        setChildren(res);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [location.key]);

  return (
    <div className="page-wrapper">
      <h2>Children List</h2>
      
      {loading && (
        <div className="empty-state">
          <div className="loading"></div>
          <p>Loading children...</p>
        </div>
      )}

      {!loading && children.length === 0 && (
        <div className="empty-state">
          <p>No children added yet</p>
          <p>Go to <a href="/add-child" style={{ color: "#667eea" }}>Add Child</a> to get started</p>
        </div>
      )}

      <div className="grid grid-3">
        {children.map(child => (
          <ChildCard key={child.id} child={child} />
        ))}
      </div>
    </div>
  );
}

export default Home;
