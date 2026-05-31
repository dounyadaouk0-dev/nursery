# 🚀 Quick Start Guide - Nursery Management System

## 5-Minute Setup

### Step 1: Start XAMPP (2 min)
1. Open XAMPP Control Panel
2. Click **Start** next to **Apache** (should turn green)
3. Click **Start** next to **MySQL** (should turn green)

### Step 2: Setup Database (2 min)
1. Open browser: http://localhost/phpmyadmin
2. Click **New** on left sidebar
3. Enter database name: `nursery_db` → Click **Create**
4. Click on **nursery_db** → Click **SQL** tab
5. Paste these commands:

```sql
CREATE TABLE children (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    age INT,
    class VARCHAR(100),
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    child_id INT,
    meal TEXT,
    sleep_hours DECIMAL(3,1),
    mood VARCHAR(50),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    child_id INT,
    check_in TIME,
    check_out TIME,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(child_id) REFERENCES children(id) ON DELETE CASCADE
);
```
6. Click **Execute** (⚡ icon)

### Step 3: Start Backend (1 min)
1. Open **Command Prompt** or **PowerShell**
2. Navigate: `cd c:\Users\user\Desktop\nursery\nursery`
3. Run: `npm install` (one time only)
4. Run: `npm start`
5. Wait for: `🚀 Server running on http://localhost:3000`

### Step 4: Start Frontend (1 min)
1. Open **new Command Prompt** or **PowerShell**
2. Navigate: `cd c:\Users\user\Desktop\nursery\nursery\frontend`
3. Run: `npm install` (one time only)
4. Run: `npm start`
5. Browser will auto-open to http://localhost:3000

## ✅ You're Done!

The app is now running! 🎉

### Test It Out:
1. Click **👶 Add Child** → Add "Emma" (Age 2, Class: Blueberry)
2. Click **🏠 Home** → See Emma in the list
3. Click on Emma's card → View her profile
4. Click **📝 Add Report** → Record Emma's activity
5. Click **📅 Attendance** → Log Emma's check-in/out

## 🛑 Troubleshooting Quick Tips

### Issue: "Cannot connect to database"
- ✅ Is MySQL running in XAMPP? (green indicator)
- ✅ Did you create nursery_db? Check: http://localhost/phpmyadmin

### Issue: "Cannot find module 'express'"
- Run: `npm install` again in the project root

### Issue: "Port 3000 already in use"
- Another app is using port 3000
- Kill the process or use a different port

### Issue: "Blank page in browser"
- Check: Is backend running? (http://localhost:3000 in browser)
- Open browser **DevTools** (F12) → Check **Console** for errors

## 📞 Need Help?

1. **Backend issues?** Check: Terminal where backend is running
2. **Frontend issues?** Check: Browser DevTools → Console tab
3. **Database issues?** Check: phpMyAdmin (http://localhost/phpmyadmin)

## 🎯 Next Steps

- Read SETUP.md for detailed documentation
- Explore all pages via the navigation menu
- Add more children and test all features
- Customize colors in `frontend/src/styles.css`

---

**Happy Managing! 🌱**
