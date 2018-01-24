var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var config  = require('./utils/config')

var bodyParser = require('body-parser');
var ejs = require('ejs');
// ejs.open = '{{';
// ejs.close = '}}';



var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
 var cors = require('cors');

// // use it before all route definitions
// app.use(cors({origin: 'http://localhost:3000'}));
app.options('*', cors());

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
  next();
});

app.utility   =     require('./app-util');
app.use(app.utility.attachWorkflow);

app.use(function (req, res, next) {
  req.response  = require('./utils/responseHandler');
  next();
});

var mysqlConnection = require('./utils/mysqlConnection');
new mysqlConnection().init();

var passport = require('passport');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
//app.use(expressSession({secret: '@3@d@c@l@u@b@h@o@u@@s@e',resave: true, saveUninitialized: true,store: new RedisStore}));
app.use(expressSession({
  store: new RedisStore(config.redisConfig),
  secret: '@3@d@c@l@u@b@h@o@u@@s@e@',
  resave: true, saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var shipRocketManager = require('./dataAccessLayer/shipRocketManager');
console.log("Shiprocket enabled");
shipRocketManager.logIn();

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
var index = require('./controllers/index');
var categories  = require('./controllers/categories');
var uCategories  = require('./controllers/user/categories');
var products  = require('./controllers/product');
var materials = require('./controllers/materials');
var colors = require('./controllers/colors');
var doodle = require('./controllers/doodleprices');
var tutorials = require('./controllers/tutorials');
var tutorialCategories = require('./controllers/tutorialCategories');
var cart = require('./controllers/usercart');
var productVariants = require('./controllers/productVariants');
var homeImageRoute = require('./controllers/homeImageRoute');
var landingImageRoute = require('./controllers/landingImageRoute');
var postProRoute = require('./controllers/postproRouter');
var taxConfRoute = require('./controllers/taxConfigRouter');
var printerConfRoute = require('./controllers/printerConfRouter');
var packageConfRoute = require('./controllers/packageConfRouter');
var fixedSlicerRoute = require('./controllers/fixedSlicerRouter');
var adminroutes = require('./controllers/adminUsers')(passport);
var users = require('./controllers/users')(passport);
app.use('/admin',adminroutes);
app.use('/admin/homeimgs',homeImageRoute);
app.use('/admin/landingimgs',landingImageRoute);
app.use('/admin/categories', categories);
app.use('/admin/product',products);
app.use('/admin/variants',productVariants);
app.use('/admin/materials',materials);
app.use('/admin/postpro',postProRoute);
app.use('/admin/taxconf',taxConfRoute);
app.use('/admin/printconf',printerConfRoute);
app.use('/admin/fixedslicer',fixedSlicerRoute);
app.use('/admin/packageconf',packageConfRoute);
app.use('/admin/colors',colors);
app.use('/admin/doodle',doodle);
app.use('/admin/tutorials',tutorials);
app.use('/admin/tutorials/categories',tutorialCategories);

app.use('/user/categories',uCategories);
app.use('/dev', index);
app.use('/', users);

app.use('/cart',cart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.path)
  if(req.path != "/admin/categories/uploadcategoryimage" && req.path != "/admin/product/uploadproductimages") {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
    res.render('main/404.html')
  }
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err)
  res.status(err.status || 500);
  res.render('main/500.html')
});

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        //process.exit(1);
    });


module.exports = app;
