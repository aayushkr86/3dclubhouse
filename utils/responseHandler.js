/**
 * Created by anooj on 06/05/17.
 */
exports.sendSuccessResponse =   function (req, data) {
    req.workflow.outcome.data   =   data;
    return req.workflow.emit('response');
};

exports.sendErrorResponse   =   function (req, error, errorArray) {
    req.workflow.outcome.errmessage = error;
    if(errorArray != undefined) {
        req.workflow.outcome.errors = errorArray;
    }else{
        req.workflow.outcome.errors = [error];
    }
    return req.workflow.emit('response')
};