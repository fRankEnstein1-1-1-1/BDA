const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema(
    {
        bigDataAnalytics: {
            type: Number,
            required: [true, "Big Data Analytics marks are required"],
            min: [0, "Marks cannot be negative"],
            max: [100, "Marks cannot exceed 100"]
        },
        dataMining: {
            type: Number,
            required: [true, "Data Mining marks are required"],
            min: [0, "Marks cannot be negative"],
            max: [100, "Marks cannot exceed 100"]
        },
        cloudComputing: {
            type: Number,
            required: [true, "Cloud Computing marks are required"],
            min: [0, "Marks cannot be negative"],
            max: [100, "Marks cannot exceed 100"]
        },
        machineLearning: {
            type: Number,
            required: [true, "Machine Learning marks are required"],
            min: [0, "Marks cannot be negative"],
            max: [100, "Marks cannot exceed 100"]
        }
    },
    { _id: false }
);

const StudentSchema = new mongoose.Schema(
    {
        rollNo: {
            type: String,
            required: [true, "Roll number is required"],
            unique: true,
            trim: true,
            uppercase: true
        },
        name: {
            type: String,
            required: [true, "Student name is required"],
            trim: true
        },
        department: {
            type: String,
            required: [true, "Department is required"],
            trim: true,
            default: "Computer Engineering"
        },
        semester: {
            type: Number,
            required: [true, "Semester is required"],
            default: 7
        },
        marks: {
            type: MarksSchema,
            required: [true, "Subject marks are required"]
        },
        attendance: {
            type: Number,
            required: [true, "Attendance percentage is required"],
            min: [0, "Attendance cannot be negative"],
            max: [100, "Attendance cannot exceed 100"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", StudentSchema);
