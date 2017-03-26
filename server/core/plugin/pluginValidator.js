'use strict';

const PluginCodeChecker = require('./pluginCodeChecker');

/**
 * Validates plugin relevant properties.
 * @constructor
 * @param {PluginManager} pluginManager
 */
function PluginValidator(pluginManager) {
    /**
     * Last or top prio validation error message.
     * @type {string}
     */
    let errorMessage = '';

    /**
     * Whether the instance has valid values.
     * @type {boolean}
     */
    let allValuesValid = true;

    /**
     * Has instance valid values.
     * @param {!Plugin} plugin
     * @returns {boolean} Whether the instance has valid values.
     */
    this.isCreatePluginRequestValid = function isCreatePluginRequestValid(plugin) {
        allValuesValid = true;

        validateId(plugin.id);
        validatePluginIdNotInUse(plugin.id);
        validateCode(plugin.code);

        return allValuesValid;
    };

    /**
     * Has instance valid values.
     * @param {!Plugin} plugin
     * @returns {boolean} Whether the instance has valid values.
     */
    this.isUpdatePluginValid = function isUpdatePluginRequestValid(plugin) {
        allValuesValid = true;

        validateId(plugin.id);
        validatePluginIdExists(plugin.id);
        validateCode(plugin.code);

        return allValuesValid;
    };

    /**
     * Check if name and code for a plugin is valid.
     * @returns {boolean} Whether the instance has valid values.
     * @param {!Plugin} plugin
     */
    this.isPluginValid = function isPluginValid(plugin) {
        allValuesValid = true;

        validateId(plugin.id);
        validateCode(plugin.code);

        return allValuesValid;
    };

    /**
     * Get the validation error message.
     * @returns {string} The validation error message.
     */
    this.getMessage = function getMessage() {
        return errorMessage;
    };

    /**
     * The plugin name shall be unique. No other plugin shall have the same name.
     * @param {string} pluginId
     */
    function validatePluginIdNotInUse(pluginId) {
        let plugin = pluginManager.getPlugin(pluginId);

        if (plugin) {
            allValuesValid = false;
            errorMessage = 'The plugin id/name is not unique. Another plugin with the same name already exists.';
        }
    }

    /**
     * The plugin id/name shall exist.
     * @param {string} pluginId
     */
    function validatePluginIdExists(pluginId) {
        let plugin = pluginManager.getPlugin(pluginId);

        if (!plugin) {
            allValuesValid = false;
            errorMessage = pluginId + ' does not exist.';
        }
    }

    /**
     * Validate name.
     * @param {string} pluginId
     */
    function validateId(pluginId) {
        let regex = /^[A-z0-9-_ ]+$/;
        let isValid = !!regex.exec(pluginId);

        allValuesValid = allValuesValid && isValid;

        if (!isValid) {
            errorMessage = 'Please correct name. Only use this characters: [A-z0-9_- ]';
        }
    }

    /**
     * Validate plugin code.
     * @param {string} code
     */
    function validateCode(code) {
        /**
         * @type {!PluginCodeChecker}
         */
        let pluginCodeChecker = new PluginCodeChecker();

        let result = pluginCodeChecker.checkCode(code);

        allValuesValid = allValuesValid && result.isValid;

        if (!result.isValid) {
            errorMessage = 'Plugin code is not valid.' + result.errors.join(' \n');
        }
    }
}

module.exports = PluginValidator;
