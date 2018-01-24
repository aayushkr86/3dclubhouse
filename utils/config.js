
exports.fb_local_config    =   {
    'appID' : '825439267603825',
    'appSecret' : '94eec3d785ac88008939d5e93ddb3cac',
    'callbackUrl' : 'http://localhost:4000/login/facebook/callback'
};

exports.fb_pro_config   =   {
    'appID' : '825439267603825',
    'appSecret' : '94eec3d785ac88008939d5e93ddb3cac',
    'callbackUrl' : 'http://localhost:4000/login/facebook/callback'
};

exports.google_config   =   {
    clientID: "369062494883-ummg1c6uffj3gsedj4ktrtmbdgkt22fo.apps.googleusercontent.com",
    clientSecret: "5z4LZM6TosHxcHdsXz2S_ell",
    callbackURL: "http://localhost:4000/login/google/callback"
}


//local server
exports.mysql_connection_local = {
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'clubhouse',
    multipleStatements: true,
    connectionLimit: 100 // max num of connections to create at once
};

//testing server
exports.mysql_connection_testing = {
    host: 'localhost',
    user: '',
    password: 'club@3d',
    database: 'clubhouse',
    multipleStatements: true,
    connectionLimit: 100
};

//production server
exports.mysql_connection_production = {
    host: 'localhost',
    user: 'root',
    password: 'club@3d',
    database: 'clubhouse',
    multipleStatements: true,
    connectionLimit: 100
};

exports.redisConfig =   {
        host: 'localhost',
        port: 6379,
        prefix: 'club',
        ttl: 1000,
        disableTTL: true,
        db: 1,
        scanCount: 32,
        unref: true
};

exports.awsConfig   =   {
    accessKeyId: "AKIAJA4XFNGPPE5GGOFQ",
    secretAccessKey: "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"
};
//
// Access Key ID:
//     AKIAJA4XFNGPPE5GGOFQ
// Secret Access Key:
//     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