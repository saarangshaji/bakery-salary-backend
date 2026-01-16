const pool = require('../config/db');

exports.createDailyClosing = async (req, res) => {
  const client = await pool.connect();

  try {
    const { branch_id, date, entries } = req.body;

    if (!branch_id || !date || !entries || !Array.isArray(entries)) {
      return res.status(400).json({
        message: 'branch_id, date, and entries are required',
      });
    }

    await client.query('BEGIN');

    // Create daily closing
    const closingResult = await client.query(
      `INSERT INTO daily_closings (branch_id, closing_date)
       VALUES ($1, $2)
       RETURNING closing_id`,
      [branch_id, date]
    );

    const closingId = closingResult.rows[0].closing_id;

    let totalAdvance = 0;

    // Insert staff-wise entries
    for (const entry of entries) {
      const amount = Number(entry.amount) || 0;
      totalAdvance += amount;

      await client.query(
        `INSERT INTO daily_closing_entries
         (closing_id, staff_id, amount)
         VALUES ($1, $2, $3)`,
        [closingId, entry.staff_id, amount]
      );
    }

    // Update total advance
    await client.query(
      `UPDATE daily_closings
       SET total_advance = $1
       WHERE closing_id = $2`,
      [totalAdvance, closingId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Daily closing saved successfully',
      total_advance: totalAdvance,
    });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Daily closing already exists for this date',
      });
    }

    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};
