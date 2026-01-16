const ExcelJS = require("exceljs");
const pool = require("../config/db");

exports.downloadMonthlySalaryReport = async (req, res) => {
  try {
    const { branch_id, month } = req.query;

    if (!branch_id || !month) {
      return res
        .status(400)
        .json({ message: "branch_id and month are required" });
    }

    const result = await pool.query(
      `
      SELECT
        s.name,
        s.monthly_salary,
        COALESCE(SUM(dce.amount), 0) AS total_advance
      FROM staff s
      LEFT JOIN daily_closing_entries dce ON dce.staff_id = s.staff_id
      LEFT JOIN daily_closings dc ON dc.closing_id = dce.closing_id
        AND to_char(dc.closing_date, 'YYYY-MM') = $2
      WHERE s.branch_id = $1
      GROUP BY s.staff_id
      ORDER BY s.name
      `,
      [branch_id, month]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Salary Report");

    sheet.columns = [
      { header: "Staff Name", key: "name", width: 25 },
      { header: "Monthly Salary", key: "monthly_salary", width: 20 },
      { header: "Total Advance", key: "total_advance", width: 20 },
      { header: "Balance", key: "balance", width: 20 },
    ];

    result.rows.forEach((row) => {
      sheet.addRow({
        name: row.name,
        monthly_salary: row.monthly_salary,
        total_advance: row.total_advance,
        balance: row.monthly_salary - row.total_advance,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=salary-report-${month}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
