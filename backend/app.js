const express = require('express');
const bodyparser  = require("body-parser")
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json())
app.use(cookieParser());

const testRoute = require("./api/route/test")
const authRoutes = require('./api/route/auth');

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoute);

module.exports = app;
