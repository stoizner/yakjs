/**
 * CreateInstanceRequest
 * @constructor
 * @param {!yak.api.Instance} instance
 */
yak.api.InstanceValidator = function InstanceValidator(instance) {
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
     * @returns {boolean} Whether the instance has valid values.
     */
    this.isValid = function isValid() {
        allValuesValid = true;

        validateName();
        validatePort();

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
     * Validate name.
     */
    function validateName() {
        var regex = /^[A-z0-9-_ ]+$/;
        var isValid = !!regex.exec(instance.name);

        allValuesValid = allValuesValid & isValid;

        if (!isValid) {
            errorMessage = 'Please correct name. Only use this characters: [A-z0-9_- ]';
        }
    }

    /**
     * Validate port number.
     */
    function validatePort() {
        var regex = /^[0-9]+$/;
        var isTextValid = !!regex.exec(instance.port);

        var isValueValid = false;

        if (isTextValid) {
            var value = parseInt(instance.port, 10);
            if (value > 0 && value < 65535) {
                isValueValid = true;
            }
        }

        allValuesValid = allValuesValid & isTextValid & isValueValid;

        if (!isValueValid) {
            errorMessage = 'Please correct port. Valid values are between 1-65535.';
        }
    }
};
