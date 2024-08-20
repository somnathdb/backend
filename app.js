var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
const cors = require("cors");
var passport = require('passport');
const client = require('./config/redisConfig')

var app = express();

client.on('connect', function () {
  console.log('Redis connected');
  client.flushall();
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

/*****************  Localhost *************/
app.locals.baseURL = "http://localhost:5004";

// view engine setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('app-assets'))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

/************ Session Created ***********/
app.use(
  session({
    secret: "secretkey14555444",
    resave: false,
    saveUninitialized: false,
  })
);



app.use(passport.initialize());
app.use(passport.session());

const mobileUser = require('./routes/mobileUser/mobileUserRoutes');
const bills = require('./routes/bills/billsRoutes');
const items = require('./routes/items/itemRoutes');
const itemCode = require('./routes/items/itemCodeRoutes');

const form16Routes = require('./routes/form16/form16Routes');


app.use('/mobileuser', mobileUser);
app.use('/bills',bills);
app.use('/items',items);
app.use('/itemsCode',itemCode);
app.use('/form16',form16Routes);

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


module.exports =app;
