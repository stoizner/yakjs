'use strict';

/**
 * @constructor
 * @struct
 */
function PluginCodeChecker() {
    /**
     * Check plugin code.
     * @param {string} pluginCode
     * @returns {{isValid:boolean, errors:[]}} list of errors
     */
    this.checkCode = function checkCode(pluginCode) {
        let result = {isValid: true, errors: []};
        let lines = pluginCode.split('\n');

        let code = pluginCode.trim();

        if (lines.length <= 0) {
            result.errors.push('No code found.');
        }

        if (code.indexOf('function') < 0) {
            result.errors.push('No function found.');
        }

        try {
            // Function is a form of eval, but we are using it here for executing custom plugin code.

            /* eslint-disable no-new-func, no-unused-vars */
            let constructor = new Function('return ' + code)();
            /* eslint-enable no-new-func */
        } catch (ex) {
            let errorMessage = [ex.name, ex.message].join(' ');
            result.errors.push(errorMessage);
        }

        if (result.errors.length > 0) {
            result.isValid = false;
        }

        return result;
    };
}

module.exports = PluginCodeChecker;
