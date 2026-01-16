const pool = require("../config/db");

// CREATE BRANCH
exports.createBranch = async (req, res) => {
  try {
    const { branch_name, location } = req.body;

    const result = await pool.query(
      "INSERT INTO branches (branch_name, location) VALUES ($1, $2) RETURNING *",
      [branch_name, location]
    );

    res.status(201).json({
      message: "Branch created successfully",
      branch: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL BRANCHES (THIS WAS MISSING)
exports.getAllBranches = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT branch_id, branch_name FROM branches WHERE is_active = true ORDER BY branch_id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
