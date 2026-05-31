import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addChild } from "../api/api";

function AddChild() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [className, setClassName] = useState("Blueberry");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !className) {
      setMessage("Please fill all required fields");
      setMessageType("error");
      return;
    }

    if (isNaN(age) || age < 1 || age > 5) {
      setMessage("Age must be between 1 and 5");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      await addChild({ name, age, className, image });
      setMessage("Child added successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setMessage("Error adding child: " + (err.response?.data?.error || err.message));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h2>Add New Child</h2>

      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <div className="form-group">
          <label>Child's Name *</label>
          <input
            type="text"
            placeholder="Enter child's full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Age *</label>
          <input
            type="number"
            placeholder="Enter age (1-5)"
            value={age}
            onChange={e => setAge(e.target.value)}
            min="1"
            max="5"
          />
        </div>

        <div className="form-group">
          <label>Class *</label>
          <select value={className} onChange={e => setClassName(e.target.value)}>
            <option value="Blueberry">Blueberry</option>
            <option value="Rose Berry">Rose Berry</option>
            <option value="BlackBerry">BlackBerry</option>
          </select>
        </div>

        <div className="form-group">
          <label>Child's Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Child"}
        </button>
      </form>
    </div>
  );
}

export default AddChild;
