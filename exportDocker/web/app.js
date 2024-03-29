var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

var apiRouter = require('./backend/api');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

module.exports = app;
