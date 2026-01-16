const express = require("express");
const router = express.Router();

const {
  downloadMonthlySalaryReport,
} = require("../controllers/report.controller");

router.get("/salary", downloadMonthlySalaryReport);

module.exports = router;
