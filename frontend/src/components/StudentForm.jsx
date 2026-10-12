import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";

export default function StudentForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    department: "Computer Engineering",
    semester: 7,
    marks: {
      bigDataAnalytics: "",
      dataMining: "",
      cloudComputing: "",
      machineLearning: ""
    },
    attendance: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        rollNo: initialData.rollNo || "",
        name: initialData.name || "",
        department: initialData.department || "Computer Engineering",
        semester: initialData.semester || 7,
        marks: {
          bigDataAnalytics: initialData.marks?.bigDataAnalytics ?? "",
          dataMining: initialData.marks?.dataMining ?? "",
          cloudComputing: initialData.marks?.cloudComputing ?? "",
          machineLearning: initialData.marks?.machineLearning ?? ""
        },
        attendance: initialData.attendance ?? ""
      });
    } else {
      setFormData({
        rollNo: "",
        name: "",
        department: "Computer Engineering",
        semester: 7,
        marks: {
          bigDataAnalytics: "",
          dataMining: "",
          cloudComputing: "",
          machineLearning: ""
        },
        attendance: ""
      });
    }
    setErrors({});
    setServerError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.rollNo.trim()) errs.rollNo = "Roll Number is required";
    if (!formData.name.trim()) errs.name = "Student Name is required";
    if (!formData.department.trim()) errs.department = "Department is required";

    const subjects = ["bigDataAnalytics", "dataMining", "cloudComputing", "machineLearning"];
    subjects.forEach((sub) => {
      const val = Number(formData.marks[sub]);
      if (formData.marks[sub] === "" || isNaN(val) || val < 0 || val > 100) {
        errs[sub] = "Score must be between 0 and 100";
      }
    });

    const att = Number(formData.attendance);
    if (formData.attendance === "" || isNaN(att) || att < 0 || att > 100) {
      errs.attendance = "Attendance must be between 0 and 100";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["bigDataAnalytics", "dataMining", "cloudComputing", "machineLearning"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        marks: {
          ...prev.marks,
          [name]: value === "" ? "" : Number(value)
        }
      }));
    } else if (name === "attendance" || name === "semester") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setServerError(err.message || "Failed to save student record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEdit ? "Edit Student Record" : "Add New Student"}
          </h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div className="alert alert-danger" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <AlertCircle size={16} />
                <span>{serverError}</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Roll Number *</label>
                <input
                  type="text"
                  name="rollNo"
                  className="form-input"
                  placeholder="e.g. BE901"
                  value={formData.rollNo}
                  onChange={handleChange}
                  disabled={isEdit}
                />
                {errors.rollNo && <div className="form-error">{errors.rollNo}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                />
                {errors.department && <div className="form-error">{errors.department}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Semester *</label>
                <input
                  type="number"
                  name="semester"
                  className="form-input"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginTop: "0.5rem", marginBottom: "0.75rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
                Academic Marks (0 - 100)
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Big Data Analytics *</label>
                <input
                  type="number"
                  name="bigDataAnalytics"
                  className="form-input"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={formData.marks.bigDataAnalytics}
                  onChange={handleChange}
                />
                {errors.bigDataAnalytics && <div className="form-error">{errors.bigDataAnalytics}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Data Mining *</label>
                <input
                  type="number"
                  name="dataMining"
                  className="form-input"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={formData.marks.dataMining}
                  onChange={handleChange}
                />
                {errors.dataMining && <div className="form-error">{errors.dataMining}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Cloud Computing *</label>
                <input
                  type="number"
                  name="cloudComputing"
                  className="form-input"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={formData.marks.cloudComputing}
                  onChange={handleChange}
                />
                {errors.cloudComputing && <div className="form-error">{errors.cloudComputing}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Machine Learning *</label>
                <input
                  type="number"
                  name="machineLearning"
                  className="form-input"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={formData.marks.machineLearning}
                  onChange={handleChange}
                />
                {errors.machineLearning && <div className="form-error">{errors.machineLearning}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Attendance Percentage (0 - 100) *</label>
              <input
                type="number"
                name="attendance"
                className="form-input"
                min="0"
                max="100"
                placeholder="0 - 100"
                value={formData.attendance}
                onChange={handleChange}
              />
              {errors.attendance && <div className="form-error">{errors.attendance}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              <span>{isSubmitting ? "Saving..." : isEdit ? "Update Student" : "Add Student"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
