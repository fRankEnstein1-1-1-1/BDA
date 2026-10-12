# MINI PROJECT REPORT
## Student Performance Analytics System Using MongoDB and NoSQL Aggregation

**Course**: Big Data Analytics (BDA)  
**Program**: Bachelor of Engineering (B.E.) — Computer Engineering  
**Academic Year**: 2026–2027  
**Semester**: VII  

---

### Academic Information & Submission Details

- **Student Name(s)**: [Student Name / Adithya Menon]
- **Roll Number(s)**: [BE-XXXXX]
- **Department**: Department of Computer Engineering
- **Institution**: [College / University Name]
- **Project Guide / Supervisor**: [Guide Name, Designation]
- **Date of Submission**: October 2026

---

## 1. Abstract

Evaluating student academic performance across tertiary educational programs involves synthesizing multi-dimensional data, including subject marks, practical evaluations, and attendance records. Conventional relational databases often encounter scalability bottlenecks when executing multi-table joins on extensive academic records. Document-oriented NoSQL databases, specifically MongoDB, present a performant alternative through embedded documents and native aggregation pipelines.

This report presents the design and implementation of a **Student Performance Analytics System** developed as a Big Data Analytics mini-project. The system models student academic records with embedded subject marks documents and leverages MongoDB's Aggregation Framework (`$project`, `$group`, `$sort`, `$cond`, `$switch`, `$avg`, and `$sum`) to compute key academic metrics in real time. The architecture integrates an Express.js REST API with a React-based data visualization dashboard. The prototype was evaluated on a seeded dataset of 200 student records, demonstrating high query efficiency, zero frontend calculation overhead, and immediate visual feedback for academic monitoring.

---

## 2. Introduction

Modern educational data mining and academic analytics rely on capturing and analyzing continuous student performance data. Educational institutions generate extensive records per cohort, encompassing internal assessments, laboratory sessions, end-semester examinations, and attendance monitoring.

In the Big Data Analytics domain, storing semi-structured and hierarchical information efficiently is essential. Relational Database Management Systems (RDBMS) mandate rigid schemas and normalize data across separate tables (e.g., `Students`, `Subjects`, `Enrollments`, `Marks`, `Attendance`). When computing cohort-wide statistical aggregates, RDBMS engines require resource-intensive `JOIN` operations that degrade throughput as data volumes expand.

Document-oriented NoSQL databases solve this challenge by storing related information together in self-contained documents (BSON format). MongoDB's built-in Aggregation Framework provides an in-database pipeline architecture modeled after the data-flow concept, allowing data filtering, transformation, grouping, and statistical reduction directly on database nodes.

---

## 3. Problem Statement

Academic administrators and faculty evaluators require continuous visibility into student performance to identify learning gaps and low-attendance trends before final grading. However:
1. **Computational Inefficiency**: Existing systems frequently retrieve raw student records into the application server memory to perform statistical averages using procedural loops, causing excessive bandwidth consumption and memory exhaustion.
2. **Schema Inflexibility**: Standard relational tables do not easily accommodate elective course variations or dynamic evaluation criteria without schema alterations.
3. **Absence of Unified Dashboards**: Raw tabular views do not provide intuitive visual representations of pass/fail ratios, subject-wise difficulty rankings, and attendance distributions.

---

## 4. Objectives

The primary objectives of this project are:
1. To design a document-oriented data model utilizing embedded documents to encapsulate academic marks and attendance within a single student entity.
2. To construct multi-stage MongoDB aggregation pipelines that execute all computational analytics at the database level:
   - Overall cohort averages and pass percentages.
   - Comparative subject performance to detect subjects with lowest averages.
   - Classification into discrete performance tiers (Excellent, Good, Average, Needs Improvement).
   - Identification of top-ranking students (Toppers).
   - Tracking students with attendance deficits (<75%).
3. To develop a decoupled REST API using Node.js and Express.js adhering to standard HTTP conventions.
4. To implement a responsive React dashboard with Recharts visualizations and full CRUD capabilities.
5. To evaluate query execution against a seeded dataset of 200 student records.

---

## 5. Existing System vs. Proposed System

| Parameter | Existing System (Traditional RDBMS / Client Compute) | Proposed System (MongoDB NoSQL Aggregation) |
|---|---|---|
| **Data Architecture** | Highly normalized relational tables requiring foreign keys | Document-oriented BSON with embedded mark documents |
| **Data Retrieval** | Multi-table `JOIN` queries across 3–4 tables | Single-collection lookups with zero join overhead |
| **Computation Location** | Fetches raw records into application server; loops in Node.js | Database server executes native aggregation pipelines |
| **Network Overhead** | High (transfers thousands of raw rows over network) | Minimal (transfers only consolidated summary JSON) |
| **Schema Flexibility** | Schema migrations required for elective course changes | Polymorphic, schema-flexible document design |
| **Visual Analytics** | Static tables or manual spreadsheet exports | Real-time interactive dashboard with Recharts |

---

## 6. Software and Hardware Requirements

### Software Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **Runtime Environment**: Node.js (v18.x or later)
- **Database Server**: MongoDB Atlas (Cloud Cluster) / MongoDB Community Server 7.0+
- **Backend Framework**: Express.js (v5.x / v4.x)
- **Frontend Framework**: React 19 with Vite (v8.x)
- **Visualization Libraries**: Recharts (v3.x), Lucide React
- **HTTP Client**: Axios (v1.x)
- **Version Control**: Git

### Hardware Requirements
- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher
- **RAM**: Minimum 4 GB (8 GB recommended)
- **Storage**: Minimum 500 MB available disk space
- **Network**: Internet connection for MongoDB Atlas access

---

## 7. System Architecture

The system utilizes a modern three-tier client-server architecture:

```text
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│        (React 19 Dashboard + Recharts + Lucide)        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                    Application Layer                   │
│         (Node.js + Express REST API Server)            │
│   ├── studentRoutes.js    -> studentController.js      │
│   └── analyticsRoutes.js  -> analyticsController.js    │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM (BSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│                     Database Layer                     │
│               (MongoDB Atlas NoSQL Store)              │
│    └── Collection: students (Embedded Marks Schema)    │
│    └── Aggregation Framework Pipeline Engine           │
└────────────────────────────────────────────────────────┘
```

---

## 8. Database Design

### 8.1 NoSQL Document Model

In MongoDB, data is stored as BSON (Binary JSON) documents. Rather than separating marks into a foreign-keyed table, subject marks are embedded directly inside the student document.

### 8.2 Document Schema Definition

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

### 8.3 Justification for Embedded Document Pattern
1. **Locality of Reference**: A student's marks and attendance are consistently queried together. Storing them in a single document minimizes disk I/O.
2. **Atomicity**: Updates to a student's marks and profile occur atomically without requiring multi-document distributed transactions.
3. **Indexing**: Unique indexes on `rollNo` ensure fast lookup with $O(1)$ to $O(\log N)$ access time.

---

## 9. Methodology

1. **Schema Specification**: Define Mongoose schemas with validation constraints for roll number uniqueness, mark ranges (0–100), and attendance limits (0–100).
2. **Dataset Synthesis**: Develop a deterministic seeding script (`seedStudents.js`) using a Linear Congruential Generator (LCG) with seed 42 to generate 200 realistic student records across distinct academic performance tiers.
3. **Pipeline Construction**: Write and verify six specialized aggregation pipelines handling summary, subject comparison, toppers, results, performance tiers, and attendance deficit.
4. **REST API Development**: Expose standard REST endpoints supporting pagination, regex searching, and HTTP error handling.
5. **Dashboard Implementation**: Build reusable UI components (KPI cards, bar charts, donut charts, data tables) using React, Axios, and Recharts.

---

## 10. MongoDB Aggregation Queries & Detailed Explanations

### Pipeline 1: Cohort Summary Analytics (`/api/analytics/summary`)
Calculates total enrolled students, overall class average across all four subjects, pass count, fail count, and cohort pass percentage.

```javascript
[
  {
    $project: {
      averageScore: {
        $avg: [
          "$marks.bigDataAnalytics",
          "$marks.dataMining",
          "$marks.cloudComputing",
          "$marks.machineLearning"
        ]
      },
      isPassed: {
        $cond: [
          {
            $and: [
              { $gte: ["$marks.bigDataAnalytics", 40] },
              { $gte: ["$marks.dataMining", 40] },
              { $gte: ["$marks.cloudComputing", 40] },
              { $gte: ["$marks.machineLearning", 40] }
            ]
          },
          1,
          0
        ]
      }
    }
  },
  {
    $group: {
      _id: null,
      totalStudents: { $sum: 1 },
      overallAverageMarks: { $avg: "$averageScore" },
      passingStudents: { $sum: "$isPassed" },
      failingStudents: {
        $sum: { $cond: [{ $eq: ["$isPassed", 1] }, 0, 1] }
      }
    }
  },
  {
    $project: {
      _id: 0,
      totalStudents: 1,
      overallAverageMarks: { $round: ["$overallAverageMarks", 2] },
      passingStudents: 1,
      failingStudents: 1,
      passPercentage: {
        $cond: [
          { $gt: ["$totalStudents", 0] },
          {
            $round: [
              { $multiply: [{ $divide: ["$passingStudents", "$totalStudents"] }, 100] },
              2
            ]
          },
          0
        ]
      }
    }
  }
]
```
**Explanation**:
- **Stage 1 (`$project`)**: Computes each individual student's average marks using the `$avg` array accumulator and evaluates a boolean pass status using `$cond` and `$and` (score $\ge 40$ in all subjects).
- **Stage 2 (`$group`)**: Consolidates all documents (`_id: null`) to sum total students, average student scores, and count passing/failing totals.
- **Stage 3 (`$project`)**: Formats numbers and calculates pass percentage using `$multiply` and `$divide`, rounding to 2 decimals using `$round`.

---

### Pipeline 2: Subject-Wise Average Marks (`/api/analytics/subjects`)
Computes the arithmetic mean for each individual subject across the entire student cohort.

```javascript
[
  {
    $group: {
      _id: null,
      totalStudents: { $sum: 1 },
      bigDataAnalytics: { $avg: "$marks.bigDataAnalytics" },
      dataMining: { $avg: "$marks.dataMining" },
      cloudComputing: { $avg: "$marks.cloudComputing" },
      machineLearning: { $avg: "$marks.machineLearning" }
    }
  },
  {
    $project: {
      _id: 0,
      totalStudents: 1,
      bigDataAnalytics: { $round: ["$bigDataAnalytics", 2] },
      dataMining: { $round: ["$dataMining", 2] },
      cloudComputing: { $round: ["$cloudComputing", 2] },
      machineLearning: { $round: ["$machineLearning", 2] }
    }
  }
]
```
**Explanation**: Uses accumulator `$avg` over each embedded mark field to find subject difficulty trends in a single aggregation step.

---

### Pipeline 3: Top 5 Performers / Toppers (`/api/analytics/toppers`)
Extracts top-ranking students based on average score.

```javascript
[
  {
    $project: {
      rollNo: 1,
      name: 1,
      department: 1,
      semester: 1,
      marks: 1,
      attendance: 1,
      averageMarks: {
        $round: [
          {
            $avg: [
              "$marks.bigDataAnalytics",
              "$marks.dataMining",
              "$marks.cloudComputing",
              "$marks.machineLearning"
            ]
          },
          2
        ]
      }
    }
  },
  { $sort: { averageMarks: -1, rollNo: 1 } },
  { $limit: 5 }
]
```
**Explanation**:
- Calculates individual average marks.
- `$sort` orders records in descending order (`-1`).
- `$limit: 5` returns only the top five records, preventing unneeded document parsing.

---

### Pipeline 4: Performance Tier Categorization (`/api/analytics/performance`)
Classifies students into academic categories based on average mark brackets:
- Excellent: $85 \le \text{avg} \le 100$
- Good: $70 \le \text{avg} < 85$
- Average: $50 \le \text{avg} < 70$
- Needs Improvement: $\text{avg} < 50$

```javascript
[
  {
    $project: {
      averageMarks: {
        $avg: [
          "$marks.bigDataAnalytics",
          "$marks.dataMining",
          "$marks.cloudComputing",
          "$marks.machineLearning"
        ]
      }
    }
  },
  {
    $project: {
      category: {
        $switch: {
          branches: [
            { case: { $gte: ["$averageMarks", 85] }, then: "Excellent" },
            { case: { $gte: ["$averageMarks", 70] }, then: "Good" },
            { case: { $gte: ["$averageMarks", 50] }, then: "Average" }
          ],
          default: "Needs Improvement"
        }
      }
    }
  },
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 }
    }
  }
]
```
**Explanation**: Uses the `$switch` operator to execute multi-condition evaluation at the database layer and `$group` by the resulting category string.

---

### Pipeline 5: Attendance Deficit Monitoring (`/api/analytics/attendance`)
Calculates average cohort attendance and counts students falling below the mandatory 75% attendance threshold.

```javascript
[
  {
    $group: {
      _id: null,
      totalStudents: { $sum: 1 },
      averageAttendance: { $avg: "$attendance" },
      lowAttendanceCount: {
        $sum: {
          $cond: [{ $lt: ["$attendance", 75] }, 1, 0]
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      totalStudents: 1,
      averageAttendance: { $round: ["$averageAttendance", 2] },
      lowAttendanceCount: 1,
      lowAttendancePercentage: {
        $round: [
          { $multiply: [{ $divide: ["$lowAttendanceCount", "$totalStudents"] }, 100] },
          2
        ]
      }
    }
  }
]
```

---

## 11. Implementation Details

### 11.1 Backend Module Organization
```text
backend/
├── config/db.js                  # MongoDB Mongoose connection handler
├── models/Student.js             # Mongoose schema with embedded subdocuments
├── controllers/
│   ├── studentController.js      # Student CRUD operations, search, pagination
│   └── analyticsController.js    # 6 MongoDB aggregation pipeline endpoints
├── routes/
│   ├── studentRoutes.js          # /api/students routes
│   └── analyticsRoutes.js        # /api/analytics routes
├── middleware/
│   └── errorMiddleware.js        # Global error and 404 handler
├── scripts/
│   └── seedStudents.js           # Deterministic 200-document seeding
└── server.js                     # Express app setup, CORS, JSON, and server initialization
```

### 11.2 Frontend Architecture
```text
frontend/src/
├── components/
│   ├── Sidebar.jsx               # Navigation tabs and database status badge
│   ├── SummaryCard.jsx           # KPI stat cards with icons and theme colors
│   ├── SubjectChart.jsx          # Recharts BarChart for subject averages
│   ├── ResultsChart.jsx          # Recharts PieChart (donut) for pass vs. fail
│   ├── PerformanceChart.jsx      # Recharts BarChart for performance categories
│   ├── TopStudentsTable.jsx      # Ranked topper records table with badges
│   └── StudentForm.jsx           # Modal dialog for Add and Edit student records
├── pages/
│   ├── Dashboard.jsx             # Analytics dashboard view
│   └── Students.jsx              # Student directory table, search, pagination
├── services/
│   └── api.js                    # Axios API service client
├── App.jsx                       # Root application component with tab routing
└── index.css                     # Design system styles
```

---

## 12. Results and Testing

### 12.1 Execution Results on Seeded Dataset (200 Records)

| Metric | Measured Value | Query Source |
|---|---|---|
| **Total Enrolled Students** | 200 | `$group` count |
| **Passing Students (All subjects $\ge 40$)** | 176 | `$cond` + `$gte` aggregation |
| **Failing Students (At least one subject $< 40$)** | 24 | `$cond` evaluation |
| **Cohort Pass Percentage** | 88.00% | Aggregation projection |
| **Overall Mean Marks** | 66.84% | `$avg` of student averages |
| **Big Data Analytics Mean** | 67.34% | `$avg` over `marks.bigDataAnalytics` |
| **Data Mining Mean** | 67.83% | `$avg` over `marks.dataMining` |
| **Cloud Computing Mean** | 65.91% | `$avg` over `marks.cloudComputing` |
| **Machine Learning Mean** | 66.28% | `$avg` over `marks.machineLearning` |
| **Average Attendance** | 83.97% | `$avg` over `attendance` |
| **Low Attendance (<75%) Students** | 32 (16.00%) | `$cond` attendance threshold |

### 12.2 Top Performers Identified by Pipeline
1. **Akash Pandey** (`BE752`): Average **95.25%** (BDA: 98, DM: 93, CC: 96, ML: 94)
2. **Karan Gupta** (`BE783`): Average **95.00%** (BDA: 98, DM: 98, CC: 98, ML: 86)
3. **Pooja Patel** (`BE738`): Average **93.25%** (BDA: 92, DM: 96, CC: 91, ML: 94)
4. **Yash Joshi** (`BE743`): Average **93.25%** (BDA: 92, DM: 94, CC: 98, ML: 89)
5. **Aniket Agarwal** (`BE807`): Average **92.75%** (BDA: 98, DM: 98, CC: 87, ML: 88)

### 12.3 API Endpoint Verification Testing

| Test Case | Method & URL | Expected Status | Result |
|---|---|---|---|
| TC-01: Health check | `GET /api/health` | `200 OK` (database: "connected") | Passed |
| TC-02: Summary aggregation | `GET /api/analytics/summary` | `200 OK` (200 students, 88% pass) | Passed |
| TC-03: Subject aggregation | `GET /api/analytics/subjects` | `200 OK` (4 subject means) | Passed |
| TC-04: Toppers aggregation | `GET /api/analytics/toppers` | `200 OK` (5 toppers returned) | Passed |
| TC-05: Results aggregation | `GET /api/analytics/results` | `200 OK` (passed & failed counts) | Passed |
| TC-06: Performance tiers | `GET /api/analytics/performance` | `200 OK` (4 tier buckets) | Passed |
| TC-07: Attendance monitoring | `GET /api/analytics/attendance` | `200 OK` (32 below 75%) | Passed |
| TC-08: Student pagination | `GET /api/students?page=1&limit=10` | `200 OK` (10 items, total: 200) | Passed |
| TC-09: Student search | `GET /api/students?q=BE701` | `200 OK` (matched student) | Passed |
| TC-10: Client production build | `npm run build` in frontend | Exit code 0, 0 compile errors | Passed |

---

## 13. Advantages and Limitations

### Advantages
1. **Computational Efficiency**: Analytics calculations happen directly inside MongoDB memory; no unneeded record transfer over the network.
2. **Document Modeling Simplicity**: Avoids complex foreign-key relationships and join tables.
3. **Real-Time Responsiveness**: Adding, editing, or deleting a student automatically updates cohort-wide metrics upon dashboard refresh.
4. **Intuitive Presentation**: Clear visualizations allow faculty to immediately detect subjects needing academic support.

### Limitations
1. **Dataset Scope**: Tested on an academic prototype dataset of 200 documents; larger production scale would benefit from pre-aggregated materialization for multi-million document collections.
2. **Single Semester Modeling**: Focuses on Semester VII courses; multi-year longitudinal tracking requires array expansion.

---

## 14. Conclusion

The **Student Performance Analytics System** successfully demonstrates the application of NoSQL document modeling and the MongoDB Aggregation Pipeline framework to solve academic analytics challenges. By embedding subject marks documents within individual student records and executing multi-stage transformations directly at the database level, the system eliminates relational join overhead and provides fast, responsive query execution. Integrated with an Express REST API and a clean React dashboard, the application serves as a robust prototype for modern academic data analytics.

---

## 15. Future Scope

1. **Integration with Apache Spark**: Connecting MongoDB with the Spark Connector for distributed big data processing on multi-institution university datasets.
2. **Predictive Failure Detection**: Incorporating machine learning classifiers (Random Forest / Logistic Regression) to generate early warning signals for students at risk of failing before semester exams.
3. **Automated Export & Transcripts**: Implementing automated PDF report card generation directly from aggregation outputs.

---

## 16. References

1. Chodorow, K. (2013). *MongoDB: The Definitive Guide: Powerful and Scalable Data Storage*. O'Reilly Media.
2. Banker, K., Bakkum, P., Verch, S., Garrett, D., & Hawkins, T. (2016). *MongoDB in Action: Covers MongoDB version 3.0*. Manning Publications.
3. MongoDB Documentation. (2026). *Aggregation Pipeline Quick Reference*. Official MongoDB Manual: `https://www.mongodb.com/docs/manual/aggregation/`.
4. Elmasri, R., & Navathe, S. B. (2015). *Fundamentals of Database Systems* (7th ed.). Pearson.
5. React Documentation. (2026). *React — A JavaScript library for building user interfaces*. `https://react.dev/`.
