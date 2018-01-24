var express = require('express');
var router = express.Router();


router.get('/',function (req, res) {
    res.render('main/home.html')
});

router.get('/home',function (req, res) {
    res.render('main/home.html')
});

router.get('/product',function (req, res) {
    res.render('main/product.html')
});
router.get('/cart',function (req, res) {
    res.render('main/cart.html')
});
router.get('/cart_empty',function (req, res) {
    res.render('main/cart_empty.html')
});
router.get('/checkout',function (req, res) {
    res.render('main/checkout.html')
});
router.get('/wishlist',function (req, res) {
    res.render('main/wishlist.html')
});
router.get('/wishlist_empty',function (req, res) {
    res.render('main/wishlist_empty.html')
});
router.get('/myaccount-billing',function (req, res) {
    res.render('main/myaccount-billing.html')
});
router.get('/myaccount-contact',function (req, res) {
    res.render('main/myaccount-contact.html')
});
router.get('/myaccount-password',function (req, res) {
    res.render('main/myaccount-password.html')
});
router.get('/myaccount-shipping',function (req, res) {
    res.render('main/myaccount-shipping.html')
});
router.get('/myaccount',function (req, res) {
    res.render('main/myaccount.html')
});
module.exports = router;
