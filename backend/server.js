const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const saveImageFromBase64 = (base64Data) => {
  if (!base64Data || typeof base64Data !== 'string') return null;
  const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) return null;
  const extension = matches[1].split('/')[1];
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  try {
    fs.writeFileSync(filePath, matches[2], 'base64');
    return fileName;
  } catch (err) {
    console.error('Failed to save image file:', err);
    return null;
  }
};
const db = mysql.createConnection({
  host: 'fdb1032.awardspace.net',
  user: '4716707_beerynursery',
  password: 'Dudususu2003@',   
  database: '4716707_beerynursery'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});
app.post('/api/children', (req, res) => {
  const { name, age, className, image } = req.body || {};
  const imageFileName = saveImageFromBase64(image);

  if (!name || !age || !className) {
    return res.status(400).json({ error: "All fields required" });
  }

  const insertSql = "INSERT INTO children (name, age, `class`, image) VALUES (?, ?, ?, ?)";
  const insertParams = [name, age, className, imageFileName || null];

  db.query(insertSql, insertParams, (err, result) => {
    if (!err) {
      return res.json({ message: "Child added successfully", id: result.insertId });
    }

    if (err.code === 'ER_BAD_FIELD_ERROR' && /Unknown column 'image'/.test(err.message)) {
      return db.query('ALTER TABLE children ADD COLUMN image TEXT', (alterErr) => {
        if (alterErr) return res.status(500).json({ error: alterErr.message });
        db.query(insertSql, insertParams, (retryErr, retryResult) => {
          if (retryErr) return res.status(500).json({ error: retryErr.message });
          res.json({ message: "Child added successfully", id: retryResult.insertId });
        });
      });
    }

    return res.status(500).json({ error: err.message });
  });
});

app.get('/api/children', (req, res) => {
  db.query("SELECT * FROM children", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/api/children/:id', (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM children WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0] || null);
  });
});

app.put('/api/children/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, className } = req.body;
  if (!name || !age || !className) {
    return res.status(400).json({ error: "All fields required" });
  }
  const sql = "UPDATE children SET name = ?, age = ?, `class` = ? WHERE id = ?";
  db.query(sql, [name, age, className, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Child updated successfully" });
  });
});

app.delete('/api/children/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM children WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Child deleted" });
  });
});
app.post('/api/reports', (req, res) => {
  const { child_id, meal, sleep_hours, mood, date } = req.body;
  if (!child_id || !date) {
    return res.status(400).json({ error: "Child and date required" });
  }
  const sql = `INSERT INTO reports (child_id, meal, sleep_hours, mood, date) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [child_id, meal, sleep_hours, mood, date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Report added", id: result.insertId });
  });
});

app.get('/api/reports', (req, res) => {
  const sql = `
    SELECT reports.*, children.name 
    FROM reports
    JOIN children ON reports.child_id = children.id
    ORDER BY date DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/api/reports/:child_id', (req, res) => {
  const { child_id } = req.params;
  const sql = `
    SELECT reports.*, children.name 
    FROM reports
    JOIN children ON reports.child_id = children.id
    WHERE reports.child_id = ?
    ORDER BY date DESC
  `;
  db.query(sql, [child_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.delete('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM reports WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Report deleted" });
  });
});
app.post('/api/attendance', (req, res) => {
  const { child_id, check_in, check_out, date } = req.body;
  if (!child_id || !date) {
    return res.status(400).json({ error: "Missing data" });
  }
  const sql = `INSERT INTO attendance (child_id, check_in, check_out, date) VALUES (?, ?, ?, ?)`;
  db.query(sql, [child_id, check_in, check_out, date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Attendance saved", id: result.insertId });
  });
});

app.get('/api/attendance', (req, res) => {
  const sql = `
    SELECT attendance.*, children.name
    FROM attendance
    JOIN children ON attendance.child_id = children.id
    ORDER BY date DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/api/attendance/child/:child_id', (req, res) => {
  const { child_id } = req.params;
  const sql = `
    SELECT attendance.*, children.name
    FROM attendance
    JOIN children ON attendance.child_id = children.id
    WHERE attendance.child_id = ?
    ORDER BY date DESC
  `;
  db.query(sql, [child_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.delete('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM attendance WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Attendance record deleted" });
  });
});
app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/email and password are required' });
  }
  const sql = `SELECT id, username, email, created_at FROM users WHERE (email = ? OR username = ?) AND password = ?`;
  db.query(sql, [identifier, identifier, password], (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results.length) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }
    res.json({ success: true, user: results[0] });
  });
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
