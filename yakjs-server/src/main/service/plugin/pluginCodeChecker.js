/**
 * PluginCodeChecker
 * @class
 * @constructor
 */
yak.PluginCodeChecker = function PluginCodeChecker() {

    'use strict';

    /**
     * @type {yak.PluginCodeChecker}
     */
    var self = this;


    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Check plugin code.
     * @param {string} code
     * @return {{isValid:boolean, errors:[]}} list of errors
     */
    this.checkCode = function checkCode(code) {

        var result = { isValid:true, errors:[] };
        var lines = code.split('\n');

        code = code.trim();

        if (lines.length <= 0) {
            result.errors.push('No code found.');
        } else {
            if (lines[0].indexOf('function') < 0) {
                result.errors.push('0: First line must contain function keyword.');
            }

            for (var i=0; i<lines.length; i++) {
                var line = lines[i];

//              Recommend logger instead of console.log. Temporally removed, because user want to use console.log
//              if (line.indexOf('console.log') >= 0) {
//                    result.errors.push(i + ': For logging, please use instance.log.info() instead of console.log()');
//              }
            }
        }

        if (result.errors.length > 0) {
            result.isValid = false;
        }

        return result;
    };

    constructor();
};