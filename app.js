const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const Type = require('./routes/TypeRoute');
const Brand = require('./routes/BrandRoute');
const Product = require('./routes/ProductRoute');
const Employee = require('./routes/EmployeeRoute');
const Dealer = require('./routes/DealerRoute');
const Receive = require('./routes/ReceiveRoute');
const Sale = require('./routes/SaleRoute');
const Change = require('./routes/ChangeRoute');
const auth = require('./routes/auth');

app.use('/api/auth', auth);
app.use('/api/type', Type);
app.use('/api/brand', Brand);
app.use('/api/product', Product);
app.use('/api/employee', Employee);
app.use('/api/dealer', Dealer);
app.use('/api/receive', Receive);
app.use('/api/sale', Sale);
app.use('/api/change', Change);
module.exports = app;
