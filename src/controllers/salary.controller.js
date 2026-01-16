const pool = require('../config/db');

exports.getMonthlySalarySummary = async (req, res) => {
  try {
    const { staff_id, month } = req.query;

    if (!staff_id || !month) {
      return res.status(400).json({
        message: 'staff_id and month are required (YYYY-MM)',
      });
    }

    const result = await pool.query(
      `
      SELECT 
        s.staff_id,
        s.name,
        s.monthly_salary,
        COALESCE(SUM(dce.amount), 0) AS total_advances,
        (s.monthly_salary - COALESCE(SUM(dce.amount), 0)) AS balance
      FROM staff s
      LEFT JOIN daily_closing_entries dce ON dce.staff_id = s.staff_id
      LEFT JOIN daily_closings dc ON dc.closing_id = dce.closing_id
      WHERE s.staff_id = $1
        AND TO_CHAR(dc.closing_date, 'YYYY-MM') = $2
      GROUP BY s.staff_id, s.name, s.monthly_salary
      `,
      [staff_id, month]
    );

    if (result.rows.length === 0) {
      return res.json({
        staff_id,
        total_advances: 0,
        balance: null,
        message: 'No data for this month',
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
