const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require("./config.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-refresh-token');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

const userRoutes = require('./routes/User');
const groupRoutes = require('./routes/Group');
const statsRoutes = require('./routes/Stats');

app.use('/api/user', userRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/stats', statsRoutes);


// Connect to Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.url + '/' + config.db.database);
mongoose.connection.on('connected', function () {
    console.log("MongoDB connected")
 });
 

app.get('/', function(req, res){
    res.send('Please use api endpoints to get or post data!');
});

const port = 8000;
app.listen(process.env.PORT || port);
console.log("server started on port: " + port);