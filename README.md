# Student Performance Analytics System — Big Data Analytics (BDA) Mini Project

A full-stack academic performance analytics platform built with **MongoDB (NoSQL Document Store & Aggregation Pipeline Engine)**, **Node.js/Express.js**, and **React (Vite)**.

Designed and developed as a semester mini-project demonstrating practical NoSQL data modeling, embedded documents, complex aggregation pipelines, and interactive data visualization for academic cohorts.

---

## 1. Abstract

Evaluating student academic performance across multiple subjects, semesters, and attendance benchmarks requires efficient data aggregation. While traditional Relational Database Management Systems (RDBMS) rely on compute-heavy multi-table `JOIN` operations, NoSQL document-oriented databases like MongoDB store hierarchical, polymorphic student records with embedded sub-documents.

This project implements a complete **Student Performance Analytics System** utilizing MongoDB's **Aggregation Framework** (`$match`, `$group`, `$project`, `$sort`, `$limit`, `$cond`, `$switch`, and accumulator operators) to compute real-time cohort statistics, subject averages, pass/fail ratios, performance distribution tiers, and attendance deficit alerts without pulling entire collections into the application layer.

---

## 2. Problem Statement

Academic institutions often struggle with:
1. **Inefficient Analytics Querying**: Running repeated relational joins across separate student, subject, marks, and attendance tables causes significant latency on large datasets.
2. **Schema Rigidity**: Traditional schemas lack flexibility for varying course electives, internal assessment structures, or modular evaluations.
3. **Lack of Immediate Visual Insights**: Faculty need immediate visual feedback to detect struggling students, subjects with abnormally low class averages, and attendance shortages before final exams.

---

## 3. Project Objectives

- Implement a document-oriented NoSQL schema in MongoDB utilizing embedded documents for subject marks.
- Build native MongoDB aggregation pipelines to calculate:
  - Overall class average and pass percentage.
  - Per-subject average marks and identification of lowest/highest performing subjects.
  - Cohort categorization into performance tiers (Excellent, Good, Average, Needs Improvement).
  - Identification of top-tier academic performers (Toppers).
  - Attendance deficit monitoring (<75%).
- Provide a responsive React dashboard with Recharts visualizations, search, and full CRUD operations.
- Maintain strict database security, clean separation of concerns, and deterministic dataset seeding.

---

## 4. Technology Stack

### Backend
- **Runtime Environment**: Node.js (v18+)
- **Framework**: Express.js
- **Database Engine**: MongoDB / MongoDB Atlas
- **ODM**: Mongoose
- **Configuration & Utilities**: dotenv, cors, nodemon

### Frontend
- **Library**: React 19 with Vite
- **Language**: JavaScript (ES6+ / JSX)
- **Data Visualization**: Recharts
- **Iconography**: Lucide React
- **HTTP Client**: Axios
- **Styling**: Modern Vanilla CSS Design System (Inter font, responsive layout)

---

## 5. System Architecture & Request Flow

```text
[ Browser / React Dashboard ]
             │
             │ HTTP REST (JSON)
             ▼
[ Express.js REST API Server ] (Port 5000)
    ├── /api/health
    ├── /api/students       --> CRUD Operations
    └── /api/analytics/*    --> MongoDB Aggregation Pipelines
             │
             │ Mongoose Driver (Binary JSON - BSON)
             ▼
[ MongoDB Document Store / Atlas Cluster ]
    └── Collection: students (Embedded Document Schema)
```

1. **Client Request**: The React dashboard issues API requests using Axios to `http://localhost:5000/api`.
2. **Controller Layer**: Express routes forward requests to controllers (`studentController.js` and `analyticsController.js`).
3. **Aggregation Engine**: For analytics, the controller dispatches multi-stage aggregation queries directly to the MongoDB server. The database engine filters, groups, projects, and summarizes records in memory.
4. **JSON Response**: Only the computed summary statistics are returned over the network, minimizing bandwidth and memory footprint.

---

## 6. MongoDB Document Schema

Students are modeled using embedded documents for subject marks:

```javascript
{
  "_id": ObjectId("6acce3d02dde6138476258ef"),
  "rollNo": "BE752",
  "name": "Akash Pandey",
  "department": "Computer Engineering",
  "semester": 7,
  "marks": {
    "bigDataAnalytics": 98,
    "dataMining": 93,
    "cloudComputing": 96,
    "machineLearning": 94
  },
  "attendance": 89,
  "createdAt": ISODate("2026-10-12T13:42:40.860Z"),
  "updatedAt": ISODate("2026-10-12T13:42:40.860Z")
}
```

### Schema Rules & Constraints:
- `rollNo`: Unique, uppercase string (e.g., `BE701`).
- `name`: String, required.
- `department`: String, default `"Computer Engineering"`.
- `semester`: Number, default `7`.
- `marks`: Embedded document with 4 subjects (`bigDataAnalytics`, `dataMining`, `cloudComputing`, `machineLearning`), each constrained between `0` and `100`.
- `attendance`: Number constrained between `0` and `100`.
- Passing criteria: A student passes only if **every** subject mark is $\ge 40$.

---

## 7. MongoDB Aggregation Techniques Used

| Aggregation Stage / Operator | Purpose in System | Endpoint |
|---|---|---|
| `$project` + `$avg` | Computes arithmetic mean of embedded array of subject marks for each student | `/api/analytics/summary`, `/api/analytics/toppers` |
| `$cond` + `$and` + `$gte` | Determines boolean pass/fail status per document based on subject pass cutoffs | `/api/analytics/summary`, `/api/analytics/results` |
| `$group` + `$avg` + `$sum` | Aggregates cohort totals, passing student counts, and class marks averages | `/api/analytics/summary`, `/api/analytics/subjects` |
| `$switch` + `branches` | Dynamically classifies continuous student average marks into discrete performance tiers | `/api/analytics/performance` |
| `$sort` + `$limit` | Identifies top 5 rank holders sorted by descending average score | `/api/analytics/toppers` |
| `$round` | Formats statistical floating point figures to two decimal places at the database level | All Analytics |

---

## 8. API Endpoint Documentation

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server status and MongoDB connection state (`connected`) |
| `GET` | `/students` | Paginated list of students with search (`?page=1&limit=10&search=BE701`) |
| `GET` | `/students/:id` | Retrieve single student by MongoDB ID |
| `POST` | `/students` | Create new student record with validation |
| `PUT` | `/students/:id` | Update existing student record |
| `DELETE` | `/students/:id` | Delete student record |
| `GET` | `/analytics/summary` | Total students, overall average, passing count, failing count, pass % |
| `GET` | `/analytics/subjects` | Average marks for BDA, Data Mining, Cloud Computing, and ML |
| `GET` | `/analytics/toppers` | Top 5 students sorted by average marks in descending order |
| `GET` | `/analytics/results` | Pass vs. Fail distribution counts and percentages |
| `GET` | `/analytics/performance` | Student distribution across 4 performance categories |
| `GET` | `/analytics/attendance` | Average attendance, count below 75%, and low-attendance students |

---

## 9. Installation & Setup Instructions

### Prerequisites
- Node.js (version 18 or above)
- npm (Node Package Manager)
- Active MongoDB connection URI (MongoDB Atlas or local MongoDB instance)

### Step 1: Clone or Navigate to Project
```bash
cd "c:\Users\Adithya Menon\OneDrive\Documents\Adithya Menon\PersonalProjects\PROJECTS\BDA_Proj"
```

### Step 2: Configure Environment Variables

**Backend (`backend/.env`)**:
The connection string is already configured via the `MONGO` variable:
```env
MONGO="your-mongodb-connection-string"
PORT=5000
```
> *Note: Placeholders are provided in `backend/.env.example`.*

**Frontend (`frontend/.env`)**:
Optional override (defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 10. Database Seeding

To clear and seed the database with **200 realistic, deterministic student records**:

```bash
cd backend
npm run seed
```

Output:
```text
Connecting to MongoDB...
Connected to MongoDB successfully.
Clearing existing Student collection records (destructive operation for reset)...
Cleared existing student documents.
Generating 200 synthetic student academic records...
Inserting records into MongoDB via insertMany()...
Successfully seeded 200 student records into MongoDB!
```

---

## 11. Running the System

Open two terminal windows:

### Terminal 1 — Start Backend Server:
```bash
cd backend
npm run dev
# Or for standard node execution: npm start
```
*Backend runs on: `http://localhost:5000`*

### Terminal 2 — Start Frontend Server:
```bash
cd frontend
npm run dev
```
*Frontend dashboard runs on: `http://localhost:5173`*

---

## 12. Verification & Example API Responses

### 1. Summary Analytics
```bash
curl http://localhost:5000/api/analytics/summary
```
```json
{
  "success": true,
  "data": {
    "totalStudents": 200,
    "passingStudents": 176,
    "failingStudents": 24,
    "overallAverageMarks": 66.84,
    "passPercentage": 88
  }
}
```

### 2. Subject Averages
```bash
curl http://localhost:5000/api/analytics/subjects
```
```json
{
  "success": true,
  "data": {
    "averages": {
      "totalStudents": 200,
      "bigDataAnalytics": 67.34,
      "dataMining": 67.83,
      "cloudComputing": 65.91,
      "machineLearning": 66.28
    },
    "lowestSubject": { "subject": "Cloud Computing", "average": 65.91 },
    "highestSubject": { "subject": "Data Mining", "average": 67.83 }
  }
}
```

### 3. Performance Distribution
```bash
curl http://localhost:5000/api/analytics/performance
```
```json
{
  "success": true,
  "total": 200,
  "data": [
    { "category": "Excellent", "range": "85 - 100", "count": 29, "percentage": 14.5 },
    { "category": "Good", "range": "70 - 84", "count": 63, "percentage": 31.5 },
    { "category": "Average", "range": "50 - 69", "count": 81, "percentage": 40.5 },
    { "category": "Needs Improvement", "range": "Below 50", "count": 27, "percentage": 13.5 }
  ]
}
```

---

## 13. Limitations & Future Scope

### Academic Scope Note
This project utilizes a 200-document dataset as an educational prototype to demonstrate NoSQL schema design and aggregation logic. In enterprise deployments, the same aggregation patterns scale horizontally using MongoDB sharded clusters, secondary read replicas, and change streams.

### Future Scope
1. **Multi-Semester Historical Tracking**: Expanding embedded documents to arrays of semester objects to calculate CGPA trends across years.
2. **Predictive Performance Alerting**: Integrating Apache Spark or PyMongo regression models to identify students at risk of failing prior to final examinations.
3. **Automated Report Generation**: Exporting personalized student report cards in PDF format directly from aggregation results.
