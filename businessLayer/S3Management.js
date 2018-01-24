
var config  =   require('../utils/config');
var aws = require('aws-sdk');
aws.config.update(config.awsConfig);
var s3 = new aws.S3({params: {Bucket: '3dclubhouse'}});

exports.uploadToS3FromLocal =   function (fileName, callback) {
    var fs      =   require('fs');
    var name    =   fileName;
    fileName    =   "/home/ubuntu/pro/3dclubhouse/temp_stl/"+fileName
    console.log(fileName);
    fs.readFile(fileName,function (er, fileData) {
        var params = {
            Key: 'products/'+name, //file.name doesn't exist as a property
            Body: fileData
        };
        s3.putObject(params,function (errr,resp) {
            

            console.log(resp);
            console.log('Successfully uploaded package.');
            fs.unlink(fileName, function (err) {
                if (err) {
                    console.error(err);
                }
                callback(errr,resp);
            });

        });
    })
}