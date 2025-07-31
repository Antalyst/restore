const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const authRoutes = require('./api/route/auth');
const itemRoutes = require('./api/route/items');

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);


module.exports = app;
