const pool = require('../config/db');

exports.createStaff = async (req, res) => {
  try {
    const {
      branch_id,
      name,
      phone,
      monthly_salary,
      payment_type,
      payment_value,
    } = req.body;

    if (!branch_id || !name || !monthly_salary) {
      return res.status(400).json({
        message: 'branch_id, name, and monthly_salary are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO staff
       (branch_id, name, phone, monthly_salary, payment_type, payment_value)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        branch_id,
        name,
        phone,
        monthly_salary,
        payment_type,
        payment_value,
      ]
    );

    res.status(201).json({
      message: 'Staff added successfully',
      staff: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStaffByBranch = async (req, res) => {
  try {
    const { branch_id } = req.query;

    if (!branch_id) {
      return res.status(400).json({ message: "branch_id is required" });
    }

    const result = await pool.query(
      `SELECT staff_id, name, monthly_salary
       FROM staff
       WHERE branch_id = $1 AND is_active = true
       ORDER BY staff_id`,
      [branch_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStaffMonthlyDetails = async (req, res) => {
  try {
    const { staff_id } = req.params;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "month is required" });
    }

    const staffResult = await pool.query(
      `SELECT staff_id, name, monthly_salary
       FROM staff
       WHERE staff_id = $1`,
      [staff_id]
    );

    if (staffResult.rows.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const advancesResult = await pool.query(
      `SELECT dc.closing_date, dce.amount
       FROM daily_closing_entries dce
       JOIN daily_closings dc ON dc.closing_id = dce.closing_id
       WHERE dce.staff_id = $1
       AND to_char(dc.closing_date, 'YYYY-MM') = $2
       ORDER BY dc.closing_date`,
      [staff_id, month]
    );

    const totalAdvance = advancesResult.rows.reduce(
      (sum, row) => sum + Number(row.amount),
      0
    );

    res.json({
      staff: staffResult.rows[0],
      advances: advancesResult.rows,
      total_advance: totalAdvance,
      balance: Number(staffResult.rows[0].monthly_salary) - totalAdvance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

