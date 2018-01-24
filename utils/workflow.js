/**
 * Created by anooj on 29/04/16.
 */
'use strict';
var fs = require('fs');
/**
 * Workflow object to send response and event based processing
 * @module Workflow
 * 
 * @param  {object}   req             request object
 * @param  {object}   res             response object
 * 
 * @return {workflow.outcome}         event emitter instance
 */
module.exports = function(req, res) {
  var workflow = new(require('events').EventEmitter)();

  /**
   * workflow.outcome namspace
   * @memberof module:Workflow
   * @property {Boolean}    success flag indicating whether the requested operation is successfull or not
   * @property {Array}      errors  array of generated errors
   * @property {Object}     errfor  customized error that fails the request
   * @property {String}     message customized message property
   * @property {undefined}  data    customized data property
   */
  workflow.outcome = {
    success: false,
    errors: [],
    errfor: {},
    message: '',
    data: undefined
  };

  /**
   * clear every files from request
   * @function clearFiles
   * @memberof module:Workflow
   */
  workflow.clearFiles = function() {
    var files = req.files;
    if (files) {
      var keys = Object.keys(files),
        temp;
      keys.forEach(function(eachKey) {
        temp = Array.isArray(files[eachKey]) ? files[eachKey] : [files[eachKey]];
        temp.forEach(function(eachFile) {
          if (eachFile.path && typeof eachFile.path === 'string') {
            fs.unlink(eachFile.path, function() {});
          }
        });
      });
    }
  };

  workflow.setMaxListeners(0);

  /**
   * check whther any error is generated or set in the workflow or worflow namespace in the properties of errors or errfor  or not
   * @return { Boolean } if set then true otherwise false
   * @function hasErrors
   * @memberof module:Workflow
   */
  workflow.hasErrors = function() {
    return Object.keys(workflow.outcome.errfor).length !== 0 || workflow.outcome.errors.length !== 0;
  };

  /**
   * @event module:Workflow~exception
   * @listens for exception event to set the errors array of the outcome {@link [workflow.outcome]}
   * after getting the error it pushes the error object into the errors array of outcome
   *  @param {Error} err error that generated during processing
   *  @fires  module:Workflow~response
   *  @inner
   */
  workflow.on('exception', function(err) {
    try {
      if ((typeof err === 'object') && !(err instanceof Error)) {
        err = JSON.parse(JSON.stringify(err));
        workflow.outcome.errfor = err;
      } else {
        workflow.outcome.errors.push('Exception: ' + err);
      }
    } catch (e) {
      workflow.outcome.errors.push('Exception: ' + err);
    } finally {
      workflow.emit('response');
    }
  });

  /**
   * @event module:Workflow~response
   * @listens for response event to send outcome object as response to the requester
   * if success property of workflow.outcome is set to false then discard the data and message property from the workflow.outcome
   * if success property of workflow.outcome is set to true then discard the errors and errfor property from the workflow.outcome and if the request type is delete then remove the data property
   * call the clear files property to remove the unnecesary files that are send with the multipart data
   */
  workflow.on('response', function() {
      console.log("RESPONSE")
    workflow.outcome.success = !workflow.hasErrors();

    if (!workflow.outcome.success) {
      delete workflow.outcome.data;
      delete workflow.outcome.message;
    } else {
      delete workflow.outcome.errors;
      delete workflow.outcome.errfor;
      if (!workflow.outcome.message) {
        delete workflow.outcome.message;
      }
      if (req.method === 'DELETE') {
        delete workflow.outcome.data;
      }
    }

    // console.log(req.body, workflow.outcome);

    workflow.clearFiles();

    res.send(workflow.outcome);

  });

  return workflow;
};
