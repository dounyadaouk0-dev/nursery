import { useEffect, useState } from "react";
import { getChildren, addReport } from "../api/api";

function AddReport() {
  const [children, setChildren] = useState([]);
  const [child_id, setChildId] = useState("");
  const [meal, setMeal] = useState("");
  const [sleep, setSleep] = useState("");
  const [mood, setMood] = useState("Happy");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getChildren().then(res => setChildren(res)).catch(err => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!child_id || !date) {
      setMessage("Please select a child and date");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      await addReport({ child_id, meal, sleep_hours: sleep, mood, date });
      setMessage(" Report added successfully!");
      setMessageType("success");
      setChildId("");
      setMeal("");
      setSleep("");
      setMood("Happy");
      setDate(new Date().toISOString().split('T')[0]);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(" Error adding report");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h2> Add Daily Report</h2>

      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <div className="form-group">
          <label>Select Child *</label>
          <select 
            value={child_id}
            onChange={e => setChildId(e.target.value)}
            required
          >
            <option value="">-- Select a child --</option>
            {children.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.class})</option>
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
          <label>Meal</label>
          <input 
            type="text"
            placeholder="e.g., Ate well, full plate"
            value={meal}
            onChange={e => setMeal(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Sleep (Hours)</label>
          <input 
            type="number"
            placeholder="e.g., 2.5"
            value={sleep}
            onChange={e => setSleep(e.target.value)}
            step="0.5"
          />
        </div>

        <div className="form-group">
          <label>Mood</label>
          <select value={mood} onChange={e => setMood(e.target.value)}>
            <option value="Happy"> Happy</option>
            <option value="Neutral"> Neutral</option>
            <option value="Fussy"> Fussy</option>
            <option value="Sleepy"> Sleepy</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Report"}
        </button>
      </form>
    </div>
  );
}

export default AddReport;