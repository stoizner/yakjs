/**
 * Validates plugin relevant properties.
 * @constructor
 * @param {!yak.PluginManager} pluginManager
 */
yak.api.PluginValidator = function PluginValidator(pluginManager) {
    'use strict';

    /**
     * Last or top prio validation error message.
     * @type {string}
     */
    var errorMessage = '';

    /**
     * Whether the instance has valid values.
     * @type {boolean}
     */
    var allValuesValid = true;

    /**
     * Has instance valid values.
     * @param {yak.api.CreatePluginRequest} request
     * @returns {boolean} Whether the instance has valid values.
     */
    this.isCreatePluginRequestValid = function isCreatePluginRequestValid(request) {
        allValuesValid = true;

        validateName(request.name);
        validatePluginIdNotInUse(request.name);
        validateCode(request.code);

        return allValuesValid;
    };

    /**
     * Has instance valid values.
     * @param {yak.api.UpdatePluginRequest} request
     * @returns {boolean} Whether the instance has valid values.
     */
    this.isUpdatePluginRequestValid = function isUpdatePluginRequestValid(request) {
        allValuesValid = true;

        validateName(request.name);
        validatePluginIdExists(request.name);
        validateCode(request.code);

        return allValuesValid;
    };

    /**
     * Check if name and code for a plugin is valid.
     * @returns {boolean} Whether the instance has valid values.
     * @param {yak.Plugin} plugin
     */
    this.isPluginValid = function isPluginValid(plugin) {
        allValuesValid = true;

        validateName(plugin.name);
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
        var plugin = pluginManager.getPlugin(pluginId);

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
        var plugin = pluginManager.getPlugin(pluginId);

        if (!plugin) {
            allValuesValid = false;
            errorMessage = 'The plugin with given id/name found.';
        }
    }

    /**
     * Validate name.
     * @param {string} name
     */
    function validateName(name) {
        var regex = /^[A-z0-9-_ ]+$/;
        var isValid = !!regex.exec(name);

        allValuesValid = allValuesValid & isValid;

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
         * @type {yak.PluginCodeChecker}
         */
        var pluginCodeChecker = new yak.PluginCodeChecker();

        var result = pluginCodeChecker.checkCode(code);

        allValuesValid = allValuesValid & result.isValid;

        if (!result.isValid) {
            errorMessage = 'Plugin code is not valid.' + result.errors.join(' \n');
        }
    }
};
