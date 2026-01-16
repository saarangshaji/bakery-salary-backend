const express = require("express");
const router = express.Router();

const {
  createStaff,
  getStaffByBranch,
  getStaffMonthlyDetails, // ✅ THIS WAS MISSING
} = require("../controllers/staff.controller");

// Create staff
router.post("/", createStaff);

// Get staff by branch
router.get("/", getStaffByBranch);

// Get staff monthly details
router.get("/:staff_id/details", getStaffMonthlyDetails);

module.exports = router;
