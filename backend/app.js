
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
const itemRoutes = require('./api/route/item');
const authRoutes = require('./api/route/auth');

app.use('/api/auth', authRoutes);
app.use('/api/item', itemRoutes);

module.exports = app;
