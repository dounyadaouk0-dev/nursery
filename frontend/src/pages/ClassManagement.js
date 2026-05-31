
import { useEffect, useMemo, useState } from "react";
import { getChildren } from "../api/api";

const classNames = ["Blueberry", "Rose Berry", "BlackBerry"];

function ClassManagement() {
  const [children, setChildren] = useState([]);
  const [activeClass, setActiveClass] = useState(classNames[0]);
  const [loading, setLoading] = useState(false);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const res = await getChildren();
      setChildren(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const grouped = useMemo(() => {
    return classNames.map(name => ({
      name,
      children: children.filter(child => child.class === name)
    }));
  }, [children]);

  const activeGroup = grouped.find(group => group.name === activeClass) || grouped[0];

  const getClassEmoji = (className) => {
    const emojis = { "Blueberry": "", "Rose Berry": "", "BlackBerry": "" };
    return emojis[className] || "";
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Class Management</h2>
        <button 
          onClick={loadChildren}
          disabled={loading}
          className="btn btn-secondary"
          style={{ padding: "8px 16px", fontSize: "14px" }}
        >
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "30px" }}>
        {grouped.map(group => (
          <button
            key={group.name}
            onClick={() => setActiveClass(group.name)}
            className={activeClass === group.name ? "btn btn-primary" : "btn btn-secondary"}
          >
            {getClassEmoji(group.name)} {group.name} ({group.children.length})
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "800px" }}>
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>{getClassEmoji(activeGroup.name)} {activeGroup.name}</h3>
            <span className="badge badge-primary">{activeGroup.children.length} children</span>
          </div>

          {activeGroup.children.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 20px" }}>
              <p> No children assigned to this class yet</p>
            </div>
          ) : (
            <div className="card-content">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {activeGroup.children.map(child => (
                    <tr key={child.id}>
                      <td><strong> {child.name}</strong></td>
                      <td>{child.age} years</td>
                      <td><span className="badge badge-primary" style={{ fontSize: "0.8rem" }}>#{child.id}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {grouped.map(group => (
          <div key={group.name} className="card" style={{ textAlign: "center" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{getClassEmoji(group.name)} {group.name}</h3>
            <p style={{ fontSize: "2.5rem", margin: "10px 0", color: "#667eea" }}>{group.children.length}</p>
            <p style={{ color: "#999", margin: 0 }}>children in class</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassManagement;
