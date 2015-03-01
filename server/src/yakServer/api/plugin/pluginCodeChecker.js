/**
 * PluginCodeChecker
 * @constructor
 */
yak.PluginCodeChecker = function PluginCodeChecker() {
    'use strict';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(this.constructor.nam);

    /**
     * Check plugin code.
     * @param {string} code
     * @returns {{isValid:boolean, errors:[]}} list of errors
     */
    this.checkCode = function checkCode(code) {

        var result = { isValid:true, errors:[] };
        var lines = code.split('\n');

        code = code.trim();

        if (lines.length <= 0) {
            result.errors.push('No code found.');
        }

        if (code.indexOf('function') < 0) {
            result.errors.push('No function found.');
        }

        try {
            // Function is a form of eval, but we are using it here for executing custom plugin code.

            /*eslint-disable no-new-func */
            var constructor = new Function('return ' + code)();
            /*eslint-enable no-new-func */
        } catch (ex) {
            var errorMessage = [ex.name, ex.message].join(' ');
            result.errors.push(errorMessage);
        }

        if (result.errors.length > 0) {
            result.isValid = false;
        }

        return result;
    };
};
