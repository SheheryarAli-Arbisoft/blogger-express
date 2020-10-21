const express = require('express');
const { connectDb } = require('./config/db');

const app = express();

connectDb();

app.use(express.json());

app.use('/api/users', require('./routes/user'));
app.use('/api/blogs', require('./routes/blog'));

const PORT = process.env.PORT || 5000;

app.listen(PORT);
