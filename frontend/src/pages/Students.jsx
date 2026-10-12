import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import StudentForm from "../components/StudentForm";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X,
  Filter
} from "lucide-react";

export default function Students({ onDataChanged }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getStudents({ page, limit, search });
      setStudents(res.students || []);
      setTotalPages(res.totalPages || 1);
      setTotalStudents(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load students list.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle Search Input with Enter or reset page on change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Create or Update Student
  const handleFormSubmit = async (formData) => {
    if (editingStudent) {
      await api.updateStudent(editingStudent._id, formData);
      showToast(`Student record for ${formData.name} updated successfully.`);
    } else {
      await api.createStudent(formData);
      showToast(`Student ${formData.name} (${formData.rollNo}) created successfully.`);
    }
    fetchStudents();
    if (onDataChanged) onDataChanged();
  };

  // Delete Student
  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await api.deleteStudent(deletingStudent._id);
      showToast(`Student ${deletingStudent.name} (${deletingStudent.rollNo}) deleted.`);
      setDeletingStudent(null);
      fetchStudents();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast(err.message || "Failed to delete student", "danger");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`alert ${notification.type === "danger" ? "alert-danger" : "alert-warning"}`}
          style={{
            backgroundColor: notification.type === "danger" ? "#fef2f2" : "#f0fdf4",
            borderColor: notification.type === "danger" ? "#fecaca" : "#bbf7d0",
            color: notification.type === "danger" ? "#991b1b" : "#166534"
          }}
        >
          {notification.type === "danger" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span style={{ fontWeight: 500 }}>{notification.message}</span>
          <button
            className="btn-icon"
            style={{ marginLeft: "auto" }}
            onClick={() => setNotification(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="toolbar">
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <div className="search-box">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={search}
              onChange={handleSearchChange}
            />
            {search && (
              <button
                className="btn-icon"
                onClick={() => setSearch("")}
                style={{ padding: "2px" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#64748b" }}>
            <span>Show:</span>
            <select
              className="form-select"
              style={{ width: "auto", padding: "0.4rem 0.6rem", fontSize: "0.85rem" }}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingStudent(null);
            setIsFormOpen(true);
          }}
        >
          <UserPlus size={16} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Student Records Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-title">Student Academic Directory</span>
            <span className="card-description">
              Showing {students.length} of {totalStudents} total registered students
            </span>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="state-container">
              <div className="spinner"></div>
              <p style={{ color: "#64748b" }}>Loading student records...</p>
            </div>
          ) : error ? (
            <div className="state-container">
              <p style={{ color: "#ef4444" }}>{error}</p>
              <button className="btn btn-secondary" onClick={fetchStudents} style={{ marginTop: "0.5rem" }}>
                Retry
              </button>
            </div>
          ) : students.length === 0 ? (
            <div className="state-container">
              <p style={{ fontWeight: 600, color: "#334155" }}>No student records found</p>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                {search ? "No students match your query. Try a different search." : "Click 'Add New Student' to create one."}
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>BDA</th>
                    <th>DM</th>
                    <th>CC</th>
                    <th>ML</th>
                    <th style={{ textAlign: "center" }}>Average</th>
                    <th style={{ textAlign: "center" }}>Result</th>
                    <th style={{ textAlign: "center" }}>Attendance</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#1e293b" }}>
                          {student.rollNo}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{student.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                          Semester {student.semester}
                        </div>
                      </td>
                      <td style={{ color: "#475569", fontSize: "0.85rem" }}>
                        {student.department}
                      </td>
                      <td>{student.marks?.bigDataAnalytics}</td>
                      <td>{student.marks?.dataMining}</td>
                      <td>{student.marks?.cloudComputing}</td>
                      <td>{student.marks?.machineLearning}</td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: 700, color: "#1e293b" }}>
                          {student.averageMarks}%
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`pill ${student.passed ? "pill-pass" : "pill-fail"}`}>
                          {student.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`pill ${student.attendance >= 75 ? "pill-neutral" : "pill-warning"}`}
                        >
                          {student.attendance}%
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.3rem" }}>
                          <button
                            className="btn-icon"
                            title="Edit Student"
                            onClick={() => {
                              setEditingStudent(student);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon delete"
                            title="Delete Student"
                            onClick={() => setDeletingStudent(student)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
              backgroundColor: "#f8fafc"
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>

            <div className="pagination-controls">
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                style={{ padding: "0.4rem 0.75rem" }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <button
                className="btn btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                style={{ padding: "0.4rem 0.75rem" }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingStudent}
      />

      {/* Delete Confirmation Modal */}
      {deletingStudent && (
        <div className="modal-overlay" onClick={() => setDeletingStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: "#ef4444" }}>Confirm Delete</h3>
              <button className="btn-icon" onClick={() => setDeletingStudent(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: "#334155", fontSize: "0.95rem" }}>
                Are you sure you want to permanently delete student{" "}
                <strong>{deletingStudent.name}</strong> (Roll:{" "}
                <code>{deletingStudent.rollNo}</code>)?
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                This document will be removed from MongoDB and cohort aggregations will update automatically.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setDeletingStudent(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
