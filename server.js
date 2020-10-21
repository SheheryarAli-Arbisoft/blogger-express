const express = require('express');
const app = express();
const { connectDb } = require('./config/db');

connectDb();

app.use(express.json());

app.use('/api/users', require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
