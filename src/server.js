require('dotenv').config();

console.log('Server file loaded');   // 🔍 ADD THIS LINE

const app = require('./app');
require('./config/db');              // 🔍 THIS MUST MATCH FOLDER STRUCTURE

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
