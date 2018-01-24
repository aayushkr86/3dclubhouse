var crypto      =   require('crypto');

exports.encodeData = function (data) {
    var shaAlgorithm = crypto.createHash('sha256');
    shaAlgorithm.update(data);
    var hashedData = shaAlgorithm.digest('hex');
    return hashedData;
};


module.exports = this;
