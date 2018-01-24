var facebook = require('./passport_auth');

module.exports = function(passport){

    passport.serializeUser(function(user, done) {
        //console.log('serializing user: ');console.log(user);
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {


        //TODO: Fetch user information from DB with this id. Callback user info.
        done(null, id);


    });

    facebook(passport);

};