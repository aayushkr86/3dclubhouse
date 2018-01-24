/**
 * Created by anooj on 29/04/16.
 */
'use strict';


/**
 * utility namespace
 * @namespace utility
 * @property {Message}                      message           instance of Message Class
 * @property {Workflow}                     workflow          acquiring the workflow
 */
var utility = {
  message: require('./utils/message'),
  workflow: require('./utils/workflow')
};



/**
 * this function attaches the workflow instance to each request object and execute the next queued function
 * @param  {object}   req    request object 
 * @param  {object}   res    response object
 * @param  {Function} next   next queued function 
 * @memberOf utility
 */
utility.attachWorkflow = function(req, res, next) {
  req.workflow = req.app.utility.workflow(req, res);
  next();
};


module.exports = utility;
