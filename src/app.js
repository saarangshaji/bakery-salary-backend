const express = require('express');
const cors = require('cors');

const branchRoutes = require('./routes/branch.routes');
const staffRoutes = require('./routes/staff.routes');
const closingRoutes = require('./routes/closing.routes');
const salaryRoutes = require('./routes/salary.routes');
const reportRoutes = require("./routes/report.routes");


const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bakery Salary API Running');
});

app.use('/api/branches', branchRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/daily-closing', closingRoutes);
app.use('/api/salary', salaryRoutes);
app.use("/api/reports", reportRoutes);


module.exports = app;
