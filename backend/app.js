const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const path = require('path');


app.use('/images', express.static(path.join(__dirname, 'api-img/img')));
app.use('/attachments', express.static(path.join(__dirname, 'api-img/attachment')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

const itemRoutes = require('./api/route/item');
const authRoutes = require('./api/route/auth');
const remarksRoutes = require('./api/route/remarks');
const unitsRoutes = require('./api/route/units');
const categoryRoutes = require('./api/route/category');
const clientRoutes = require('./api/route/client');
const stageOneRoutes = require('./api/route/stageOne');
const stageTwoRoutes = require('./api/route/stageTwo');
const groupLeadersRoutes = require('./api/route/groupLeaders');
const groupCodeRoutes = require('./api/route/groupCode');
const failedRoutes = require('./api/route/failed');
const finalStageRoutes = require('./api/route/finalStage');


app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/remarks', remarksRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/stageone', stageOneRoutes);
app.use('/api/stagetwo', stageTwoRoutes);
app.use('/api/groupleaders', groupLeadersRoutes);
app.use('/api/groupcode', groupCodeRoutes);
app.use('/api/failed', failedRoutes);
app.use('/api/finalstage', finalStageRoutes);

module.exports = app;
