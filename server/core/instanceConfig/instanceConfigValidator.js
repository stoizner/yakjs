'use strict';

/**
 * Validate properties of {yak.api.InstanceConfig}.
 * @constructor
 * @param {!yak.api.InstanceConfig} instance
 */
function InstanceConfigValidator(instance) {
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
        let regex = /^[A-z0-9-_ ]+$/;
        let isValid = !!regex.exec(instance.name);

        allValuesValid = allValuesValid & isValid;

        if (!isValid) {
            errorMessage = 'Please correct name. Only use this characters: [A-z0-9_- ]';
        }
    }

    /**
     * Validate port number.
     */
    function validatePort() {
        let regex = /^[0-9]+$/;
        let isTextValid = !!regex.exec(instance.port);

        let isValueValid = false;

        if (isTextValid) {
            let value = parseInt(instance.port, 10);
            if (value > 0 && value < 65535) {
                isValueValid = true;
            }
        }

        allValuesValid = allValuesValid & isTextValid & isValueValid;

        if (!isValueValid) {
            errorMessage = 'Please correct port. Valid values are between 1-65535.';
        }
    }
}

module.exports = InstanceConfigValidator;
