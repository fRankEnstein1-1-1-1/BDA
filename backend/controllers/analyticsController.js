const Student = require("../models/Student");

/**
 * @desc    Get academic summary (total students, overall avg marks, pass %, pass/fail count)
 * @route   GET /api/analytics/summary
 */
const getSummaryAnalytics = async (req, res, next) => {
    try {
        const result = await Student.aggregate([
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
                        $sum: {
                            $cond: [{ $eq: ["$isPassed", 1] }, 0, 1]
                        }
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
                                    {
                                        $multiply: [
                                            { $divide: ["$passingStudents", "$totalStudents"] },
                                            100
                                        ]
                                    },
                                    2
                                ]
                            },
                            0
                        ]
                    }
                }
            }
        ]);

        const summary = result.length > 0
            ? result[0]
            : {
                totalStudents: 0,
                overallAverageMarks: 0,
                passingStudents: 0,
                failingStudents: 0,
                passPercentage: 0
            };

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get average marks per subject
 * @route   GET /api/analytics/subjects
 */
const getSubjectAnalytics = async (req, res, next) => {
    try {
        const result = await Student.aggregate([
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
                    bigDataAnalytics: { $round: [{ $ifNull: ["$bigDataAnalytics", 0] }, 2] },
                    dataMining: { $round: [{ $ifNull: ["$dataMining", 0] }, 2] },
                    cloudComputing: { $round: [{ $ifNull: ["$cloudComputing", 0] }, 2] },
                    machineLearning: { $round: [{ $ifNull: ["$machineLearning", 0] }, 2] }
                }
            }
        ]);

        const raw = result.length > 0
            ? result[0]
            : {
                totalStudents: 0,
                bigDataAnalytics: 0,
                dataMining: 0,
                cloudComputing: 0,
                machineLearning: 0
            };

        const subjectsArray = [
            { subject: "Big Data Analytics", key: "bigDataAnalytics", average: raw.bigDataAnalytics },
            { subject: "Data Mining", key: "dataMining", average: raw.dataMining },
            { subject: "Cloud Computing", key: "cloudComputing", average: raw.cloudComputing },
            { subject: "Machine Learning", key: "machineLearning", average: raw.machineLearning }
        ];

        // Identify highest and lowest subject averages
        const sorted = [...subjectsArray].sort((a, b) => a.average - b.average);
        const lowestSubject = sorted[0];
        const highestSubject = sorted[sorted.length - 1];

        res.status(200).json({
            success: true,
            data: {
                averages: raw,
                subjects: subjectsArray,
                lowestSubject,
                highestSubject
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get top 5 students sorted by average marks descending
 * @route   GET /api/analytics/toppers
 */
const getToppersAnalytics = async (req, res, next) => {
    try {
        const toppers = await Student.aggregate([
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
            {
                $sort: { averageMarks: -1, rollNo: 1 }
            },
            {
                $limit: 5
            }
        ]);

        res.status(200).json({
            success: true,
            count: toppers.length,
            data: toppers
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get pass vs fail counts and rates
 * @route   GET /api/analytics/results
 */
const getResultsAnalytics = async (req, res, next) => {
    try {
        const result = await Student.aggregate([
            {
                $project: {
                    status: {
                        $cond: [
                            {
                                $and: [
                                    { $gte: ["$marks.bigDataAnalytics", 40] },
                                    { $gte: ["$marks.dataMining", 40] },
                                    { $gte: ["$marks.cloudComputing", 40] },
                                    { $gte: ["$marks.machineLearning", 40] }
                                ]
                            },
                            "Passed",
                            "Failed"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        let passedCount = 0;
        let failedCount = 0;

        result.forEach((item) => {
            if (item._id === "Passed") passedCount = item.count;
            if (item._id === "Failed") failedCount = item.count;
        });

        const total = passedCount + failedCount;
        const passRate = total > 0 ? parseFloat(((passedCount / total) * 100).toFixed(2)) : 0;
        const failRate = total > 0 ? parseFloat(((failedCount / total) * 100).toFixed(2)) : 0;

        res.status(200).json({
            success: true,
            data: {
                total,
                passedCount,
                failedCount,
                passRate,
                failRate,
                distribution: [
                    { status: "Passed", count: passedCount, percentage: passRate },
                    { status: "Failed", count: failedCount, percentage: failRate }
                ]
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get student distribution across performance categories
 * @route   GET /api/analytics/performance
 */
const getPerformanceAnalytics = async (req, res, next) => {
    try {
        const result = await Student.aggregate([
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
        ]);

        const countsMap = {
            "Excellent": 0,
            "Good": 0,
            "Average": 0,
            "Needs Improvement": 0
        };

        result.forEach((item) => {
            if (countsMap[item._id] !== undefined) {
                countsMap[item._id] = item.count;
            }
        });

        const total = Object.values(countsMap).reduce((a, b) => a + b, 0);

        const categories = [
            {
                category: "Excellent",
                range: "85 - 100",
                count: countsMap["Excellent"],
                percentage: total > 0 ? parseFloat(((countsMap["Excellent"] / total) * 100).toFixed(2)) : 0
            },
            {
                category: "Good",
                range: "70 - 84",
                count: countsMap["Good"],
                percentage: total > 0 ? parseFloat(((countsMap["Good"] / total) * 100).toFixed(2)) : 0
            },
            {
                category: "Average",
                range: "50 - 69",
                count: countsMap["Average"],
                percentage: total > 0 ? parseFloat(((countsMap["Average"] / total) * 100).toFixed(2)) : 0
            },
            {
                category: "Needs Improvement",
                range: "Below 50",
                count: countsMap["Needs Improvement"],
                percentage: total > 0 ? parseFloat(((countsMap["Needs Improvement"] / total) * 100).toFixed(2)) : 0
            }
        ];

        res.status(200).json({
            success: true,
            total,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get attendance analytics (avg attendance, low attendance count < 75%)
 * @route   GET /api/analytics/attendance
 */
const getAttendanceAnalytics = async (req, res, next) => {
    try {
        const result = await Student.aggregate([
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    averageAttendance: { $avg: "$attendance" },
                    lowAttendanceCount: {
                        $sum: {
                            $cond: [{ $lt: ["$attendance", 75] }, 1, 0]
                        }
                    },
                    normalAttendanceCount: {
                        $sum: {
                            $cond: [{ $gte: ["$attendance", 75] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalStudents: 1,
                    averageAttendance: { $round: [{ $ifNull: ["$averageAttendance", 0] }, 2] },
                    lowAttendanceCount: 1,
                    normalAttendanceCount: 1,
                    lowAttendancePercentage: {
                        $cond: [
                            { $gt: ["$totalStudents", 0] },
                            {
                                $round: [
                                    {
                                        $multiply: [
                                            { $divide: ["$lowAttendanceCount", "$totalStudents"] },
                                            100
                                        ]
                                    },
                                    2
                                ]
                            },
                            0
                        ]
                    }
                }
            }
        ]);

        const attendanceData = result.length > 0
            ? result[0]
            : {
                totalStudents: 0,
                averageAttendance: 0,
                lowAttendanceCount: 0,
                normalAttendanceCount: 0,
                lowAttendancePercentage: 0
            };

        // Also fetch students with low attendance (< 75%) for actionable student support
        const lowAttendanceStudents = await Student.find({ attendance: { $lt: 75 } })
            .select("rollNo name department attendance")
            .sort({ attendance: 1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                ...attendanceData,
                lowAttendanceStudents
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSummaryAnalytics,
    getSubjectAnalytics,
    getToppersAnalytics,
    getResultsAnalytics,
    getPerformanceAnalytics,
    getAttendanceAnalytics
};
