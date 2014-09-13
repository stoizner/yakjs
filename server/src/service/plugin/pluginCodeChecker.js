/**
 * PluginCodeChecker
 * @class
 * @constructor
 */
yak.PluginCodeChecker = function PluginCodeChecker() {
    /**
     * @type {yak.PluginCodeChecker}
     */
    var self = this;

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

        if (result.errors.length > 0) {
            log.debug('Code has errors.', {code: code, result:result});
            result.isValid = false;
        }

        return result;
    };
};
