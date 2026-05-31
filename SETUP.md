# 🌱 Nursery Management System

A full-featured web application for managing nursery operations including child profiles, daily reports, attendance tracking, and class management.

## ✨ Features

- **👶 Child Management**: Add, edit, view, and delete child profiles
- **📝 Daily Reports**: Track meal intake, sleep hours, and mood for each child
- **📅 Attendance Tracking**: Record check-in and check-out times
- **🎓 Class Management**: Organize children into different classes
- **⚙️ Admin Dashboard**: View statistics, recent activity, and perform bulk operations
- **🎨 Responsive Design**: Beautiful, mobile-friendly interface
- **💾 Database Integration**: MySQL with XAMPP

## 📋 Project Structure

```
nursery/
├── backend/
│   └── server.js           # Express.js API server
├── frontend/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── api/            # API calls
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css      # Global styles
│   ├── public/
│   └── package.json
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- XAMPP (with MySQL)
- npm or yarn

### 1. Setup XAMPP & Database

**Step 1: Start XAMPP Services**
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Verify both are running (green indicators)

**Step 2: Create Database**
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create new database: `nursery_db`
3. Run the following SQL commands in the query window:

```sql
-- Create children table
CREATE TABLE children (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    age INT,
    class VARCHAR(100),
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
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

-- Create attendance table
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

### 2. Setup Backend

```bash
# Navigate to project root
cd c:\Users\user\Desktop\nursery\nursery

# Install dependencies
npm install

# Start backend server (runs on http://localhost:3000)
npm start
# OR for development with auto-reload:
npm run dev
```

### 3. Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server (runs on http://localhost:3000)
npm start
```

> **Note**: The frontend runs on port 3000 by default. If the backend is also on 3000, the backend should run on a different port. Update the API_BASE_URL in `frontend/src/api/api.js` if needed.

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **phpMyAdmin**: http://localhost/phpmyadmin

## 📱 Available Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | View all children in a grid layout |
| Add Child | `/add-child` | Form to add a new child |
| Child Profile | `/child/:id` | Detailed profile with reports and attendance |
| Add Report | `/add-report` | Record daily meal, sleep, and mood |
| Reports | `/reports` | View all reports with filtering |
| Attendance | `/attendance` | Record and view daily attendance |
| View Attendance | `/all-attendance` | Browse all attendance records |
| Classes | `/classes` | Manage children by class |
| Admin Dashboard | `/admin` | Statistics and quick actions |

## 🛠️ API Endpoints

### Children
- `GET /api/children` - Get all children
- `GET /api/children/:id` - Get single child
- `POST /api/children` - Add new child
- `PUT /api/children/:id` - Update child
- `DELETE /api/children/:id` - Delete child

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:child_id` - Get reports for a child
- `POST /api/reports` - Add report
- `DELETE /api/reports/:id` - Delete report

### Attendance
- `GET /api/attendance` - Get all attendance
- `GET /api/attendance/child/:child_id` - Get attendance for a child
- `POST /api/attendance` - Add attendance
- `DELETE /api/attendance/:id` - Delete attendance

## 📊 Classes

The system includes three predefined classes:
- 🫐 **Blueberry** (Peanut allergy consideration)
- 🌹 **Rose Berry** (Milk allergy consideration)
- 🖤 **BlackBerry** (Soy allergy consideration)

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds, smooth animations
- **Responsive Grid**: Auto-adjusting layouts for all screen sizes
- **Color-coded Badges**: Quick visual identification of status
- **Intuitive Navigation**: Clear menu structure with emojis
- **Form Validation**: Client and server-side validation
- **Success/Error Messages**: User-friendly feedback

## 📝 Example Data

When testing, create some sample data:

**Add Children**
- Name: Emma, Age: 2, Class: Blueberry
- Name: Liam, Age: 3, Class: Rose Berry
- Name: Olivia, Age: 4, Class: BlackBerry

**Add Reports** (for each child)
- Date: Today
- Meal: Ate well, full plate
- Sleep: 2.5 hours
- Mood: Happy

**Record Attendance**
- Select child, enter date, check-in time (9:00 AM), check-out time (3:00 PM)

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure MySQL is running in XAMPP
- Check database credentials in `backend/server.js`
- Default: host: localhost, user: root, password: (empty)
- Database name: nursery_db

### Frontend API Errors
- Verify backend is running on correct port
- Check API_BASE_URL in `frontend/src/api/api.js`
- Clear browser cache and refresh

### CORS Issues
- CORS is enabled in backend (`cors` package)
- If issues persist, check backend server logs

### Database Errors
- Verify all tables are created in phpMyAdmin
- Check table names match SQL commands
- Test connection: `mysql -u root`

## 🚀 Future Enhancements

- [ ] User authentication and role-based access
- [ ] Photo uploads for child profiles
- [ ] Email notifications to parents
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced analytics and reporting
- [ ] Integration with payment systems

## 📚 Technologies Used

**Frontend:**
- React 18+
- React Router
- Axios (HTTP client)
- CSS3 (Grid, Flexbox, Animations)

**Backend:**
- Node.js
- Express.js
- MySQL2
- CORS
- Dotenv

**Database:**
- MySQL (via XAMPP)

## 📄 License

MIT License - Free to use and modify

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Check backend server logs
4. Verify database tables in phpMyAdmin

---

**Happy Managing! 🎉**
