const express = require('express');
const { connectDb } = require('./config/db');

const app = express();

connectDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
