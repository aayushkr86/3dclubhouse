/**
 * Created by anooj on 26/06/17.
 */

module.exports  =   function (app, passport) {
    var categories  = require('./controllers/categories');
    var products  = require('./controllers/product');
    var materials = require('./controllers/materials');
    var colors = require('./controllers/colors');
    var adminroutes = require('./controllers/adminUsers')(passport);
    app.use('/',adminroutes)
    app.use('/categories', categories);
    app.use('/product',products);
    app.use('/materials',materials);
    app.use('/colors',colors);
};