var async = require('async');
var mysql = require('mysql');
var EXPIRY_TIME_LIMIT = 10;    //  10 seconds
var config = require('./config');


function Connection() {
}

var pool;
Connection.prototype.init = function () {
    if(process.env.RUNNING_HOST == 1){
        console.log("Production MYSQL DB connected")
        pool = mysql.createPool(config.mysql_connection_production);
    }
    else{
        pool = mysql.createPool(config.mysql_connection_local);
        console.log("Local/ Testing MYSQL DB connected")
    }

    pool.on('error',function(err){
        console.log("on error ",err);
    });
    pool.on('enqueue', function () {
        console.log('Waiting for available connection slot...........');
    });
};

Connection.prototype.closeConnection = function (connection) {
    connection.end();
};

function currentTime() {
    return Math.round((new Date().getTime()) / 1000);
}

function cb(err, result) {
    var val = result;
}

function handleDisconnect(callback, timeLimit) {

    pool.getConnection(function (err, connection) {
        console.log("----------")
        console.log(err)
        if (err) {
            // error in getting db connection
            // reconnect after a time interval

            //console.log('could not get db connection. Re-connecting...');
            setTimeout(function () {
                if (currentTime() < timeLimit) {
                    handleDisconnect(callback, timeLimit);
                } else {
                    return callback(new Error('db error'));
                }
            }, 1000);
        } else {
            connection.setMaxListeners(connection.getMaxListeners() + 1);
            async.series([
                function (cb) {
                    connection.on('error', function (err) {
                        // utility.logEvent(err);
                        connection.destroy();
                        if (currentTime() < timeLimit) {
                            handleDisconnect(callback, timeLimit);
                        } else {
                            return callback(new Error('db error'));
                        }
                    });
                    cb(null, 2);
                },
                function (cb) {
                    return callback(null, connection);
                    cb(null, 4);
                }
            ]);
        }
    });
}

function getConnection(callback) {
    handleDisconnect(callback,
        currentTime() + EXPIRY_TIME_LIMIT
    );
}


Connection.prototype.executeQuery = function (query,parameters,callback) {
    getConnection(function (err, connection) {
        console.log(err)
        console.log(query)
        connection.query(query,parameters,function (err, rows) {
            connection.release();
            if (err) {
                throw err;
            }

            callback(err,rows);
        });
    });

};


Connection.prototype.query = function (query,parameters,callback) {
    if (typeof parameters === 'function') {
        getConnection(function (err, connection) {
            connection.query(query,function (err, rows) {
                connection.release();
                if (err) {

                    throw err;
                }
                parameters(err,rows);
            });
        });
    }
    else{
        getConnection(function (err, connection) {
            connection.query(query,parameters,function (err, rows) {
                connection.release();
                if (err) {

                    throw err;
                }
                callback(err,rows);
            });
        });
    }
};

Connection.prototype.escape = function(parameter){
    return pool.escape(parameter);
}

Connection.prototype.beginTransaction = function (callback) {
    getConnection(function (err, connection) {
        connection.beginTransaction(function(error){
            callback(error,connection)
        })
    });
};

Connection.prototype.rollback = function (connection,callback) {
    connection.rollback(function(){
        connection.release();
        callback()
    })
};

Connection.prototype.commit = function (connection,callback) {
    if(connection && typeof connection.commit == 'function' &&  typeof connection.release == 'function'){
        connection.commit(function(error){
            connection.release();
            callback(error)
        })
    }
    else{
        callback(null)
    }
};


module.exports=Connection;
