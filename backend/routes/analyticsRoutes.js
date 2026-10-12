const express = require("express");
const router = express.Router();
const {
    getSummaryAnalytics,
    getSubjectAnalytics,
    getToppersAnalytics,
    getResultsAnalytics,
    getPerformanceAnalytics,
    getAttendanceAnalytics
} = require("../controllers/analyticsController");

router.get("/summary", getSummaryAnalytics);
router.get("/subjects", getSubjectAnalytics);
router.get("/toppers", getToppersAnalytics);
router.get("/results", getResultsAnalytics);
router.get("/performance", getPerformanceAnalytics);
router.get("/attendance", getAttendanceAnalytics);

module.exports = router;
