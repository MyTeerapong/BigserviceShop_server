const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const Type = require('./routes/TypeRoute');
const Brand = require('./routes/BrandRoute');

// const authRoutes = require('./routes/auth');
app.use('/api/type', Type);
app.use('/api/brand', Brand);

module.exports = app;
