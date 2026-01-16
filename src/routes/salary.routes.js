const express = require('express');
const router = express.Router();

const {
  getMonthlySalarySummary,
} = require('../controllers/salary.controller');

router.get('/summary', getMonthlySalarySummary);

module.exports = router;
