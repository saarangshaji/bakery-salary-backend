const express = require("express");
const router = express.Router();

const {
  createBranch,
  getAllBranches,
} = require("../controllers/branch.controller");

router.post("/", createBranch);

// ✅ THIS LINE IS REQUIRED
router.get("/", getAllBranches);

module.exports = router;
