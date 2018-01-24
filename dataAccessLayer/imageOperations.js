/**
 * Created by anooj on 18/06/17.
 */
var config  =   require('../utils/config');
var aws = require('aws-sdk');
aws.config.update(config.awsConfig);
var bucketName  =   "3dclubhouse";
var s3 = new aws.S3({ /* ... */})

exports.deleteObject    =   function (fileName, callback) {
    var folderPath  =   "categories";
    var split   =   fileName.split("/");
    fileName    =   (split[split.length-1])
    folderPath  =   (split[split.length-2])
    console.log("Deleting: "+folderPath+"/"+fileName)
    s3.deleteObject({
        Bucket: bucketName,
        Key: folderPath+'/'+fileName
    },function (err,data){
        console.log("Data Delete")
        console.log(err);
        console.log(data);
        if(callback != undefined && callback != null){
            callback(err,data);
        }
    })
}