var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main/index.html', { title: 'Express' });
});
router.get('/products',function (req, res) {
    res.render('main/productdetail.html');
});

router.get('/adminlogin',function (req, res) {
    res.render('admin/adminlogin.html')
});

router.get('/dashboard',function (req, res) {
    res.render('admin/admindashboard.html')
});

module.exports = router;