const Student = require("../models/Student");

/**
 * Helper to compute average marks and pass/fail status
 */
const enrichStudent = (student) => {
    const studentObj = student.toObject ? student.toObject() : student;
    const { bigDataAnalytics = 0, dataMining = 0, cloudComputing = 0, machineLearning = 0 } = studentObj.marks || {};
    const averageMarks = parseFloat(((bigDataAnalytics + dataMining + cloudComputing + machineLearning) / 4).toFixed(2));
    const passed = (
        bigDataAnalytics >= 40 &&
        dataMining >= 40 &&
        cloudComputing >= 40 &&
        machineLearning >= 40
    );

    return {
        ...studentObj,
        averageMarks,
        passed,
        status: passed ? "Pass" : "Fail"
    };
};

/**
 * @desc    Get all students with search & pagination
 * @route   GET /api/students
 */
const getStudents = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search || req.query.q || "";

        const query = {};
        if (search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [{ name: regex }, { rollNo: regex }];
        }

        const total = await Student.countDocuments(query);
        const totalPages = Math.ceil(total / limit) || 1;

        const students = await Student.find(query)
            .sort({ rollNo: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const enrichedStudents = students.map(enrichStudent);

        res.status(200).json({
            success: true,
            count: enrichedStudents.length,
            total,
            page,
            totalPages,
            students: enrichedStudents
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single student by ID
 * @route   GET /api/students/:id
 */
const getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            student: enrichStudent(student)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new student
 * @route   POST /api/students
 */
const createStudent = async (req, res, next) => {
    try {
        const { rollNo, name, department, semester, marks, attendance } = req.body;

        // Basic validation
        if (!rollNo || !name || !marks || attendance === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please provide rollNo, name, marks (all 4 subjects), and attendance."
            });
        }

        const existing = await Student.findOne({ rollNo: rollNo.trim().toUpperCase() });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Student with roll number ${rollNo.toUpperCase()} already exists.`
            });
        }

        const student = await Student.create({
            rollNo: rollNo.trim().toUpperCase(),
            name: name.trim(),
            department: department || "Computer Engineering",
            semester: semester || 7,
            marks: {
                bigDataAnalytics: Number(marks.bigDataAnalytics),
                dataMining: Number(marks.dataMining),
                cloudComputing: Number(marks.cloudComputing),
                machineLearning: Number(marks.machineLearning)
            },
            attendance: Number(attendance)
        });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: enrichStudent(student)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a student by ID
 * @route   PUT /api/students/:id
 */
const updateStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const { rollNo, name, department, semester, marks, attendance } = req.body;

        // If rollNo is modified, check uniqueness
        if (rollNo && rollNo.toUpperCase() !== student.rollNo) {
            const conflict = await Student.findOne({ rollNo: rollNo.trim().toUpperCase() });
            if (conflict) {
                return res.status(400).json({
                    success: false,
                    message: `Roll number ${rollNo.toUpperCase()} is already in use by another student.`
                });
            }
            student.rollNo = rollNo.trim().toUpperCase();
        }

        if (name) student.name = name.trim();
        if (department) student.department = department.trim();
        if (semester !== undefined) student.semester = Number(semester);
        if (attendance !== undefined) student.attendance = Number(attendance);

        if (marks) {
            if (marks.bigDataAnalytics !== undefined) student.marks.bigDataAnalytics = Number(marks.bigDataAnalytics);
            if (marks.dataMining !== undefined) student.marks.dataMining = Number(marks.dataMining);
            if (marks.cloudComputing !== undefined) student.marks.cloudComputing = Number(marks.cloudComputing);
            if (marks.machineLearning !== undefined) student.marks.machineLearning = Number(marks.machineLearning);
        }

        const updatedStudent = await student.save();

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student: enrichStudent(updatedStudent)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a student by ID
 * @route   DELETE /api/students/:id
 */
const deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await Student.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: `Student with roll number ${student.rollNo} deleted successfully`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
