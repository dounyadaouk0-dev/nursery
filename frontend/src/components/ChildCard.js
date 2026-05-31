import { Link } from "react-router-dom";

function ChildCard({ child }) {
  const imageUrl = child.image
    ? child.image.startsWith("http") || child.image.startsWith("data:")
      ? child.image
      : child.image.startsWith("/uploads")
        ? `http://berrynursery.atwebpages.com${child.image}`
        : `http://berrynursery.atwebpages.com/uploads/${child.image}`
    : "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <Link to={`/child/${child.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "28px 20px 20px",
        boxShadow: "0 2px 16px rgba(91, 61, 184, 0.08)",
        border: "0.5px solid #DDD6F5",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        textAlign: "center",
        cursor: "pointer",
        position: "relative",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(91, 61, 184, 0.15)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 16px rgba(91, 61, 184, 0.08)";
        }}
      >
        {/* Purple top accent bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "4px",
          borderRadius: "16px 16px 0 0",
          background: "linear-gradient(90deg, #5B3DB8, #7C5DC7)",
        }} />

        {/* Circular avatar */}
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          overflow: "hidden",
          margin: "0 auto 16px",
          border: "3px solid #7C5DC7",
          boxShadow: "0 4px 14px rgba(91, 61, 184, 0.2)",
        }}>
          <img
            src={imageUrl}
            alt={child.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
          />
        </div>

        {/* Name */}
        <h3 style={{
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#2D1F5E",
          marginBottom: "8px",
        }}>
          {child.name}
        </h3>

        {/* Class badge */}
        <span style={{
          display: "inline-block",
          padding: "4px 14px",
          borderRadius: "100px",
          background: "#EEEDFE",
          color: "#5B3DB8",
          fontSize: "0.8rem",
          fontWeight: "600",
          marginBottom: "16px",
        }}>
          {child.class}
        </span>

        {/* Divider */}
        <div style={{ height: "0.5px", background: "#EAE5F8", margin: "0 0 14px" }} />

        {/* Info rows */}
        <div style={{ textAlign: "left", padding: "0 6px" }}>
          <p style={{
            fontSize: "0.88rem",
            marginBottom: "6px",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <span style={{ color: "#9B8DC4", fontWeight: "500" }}>Age</span>
            <span style={{ color: "#2D1F5E", fontWeight: "600" }}>{child.age} years</span>
          </p>
          <p style={{
            fontSize: "0.88rem",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <span style={{ color: "#9B8DC4", fontWeight: "500" }}>Class</span>
            <span style={{ color: "#2D1F5E", fontWeight: "600" }}>{child.class}</span>
          </p>
        </div>

        {/* View profile */}
        <p style={{
          marginTop: "16px",
          fontSize: "0.85rem",
          color: "#5B3DB8",
          fontWeight: "500",
          textAlign: "center",
        }}>
          View profile →
        </p>
      </div>
    </Link>
  );
}

export default ChildCard;
