const express = require('express');
const router = express.Router();

const { createDailyClosing } = require('../controllers/closing.controller');

router.post('/', createDailyClosing);

module.exports = router;
