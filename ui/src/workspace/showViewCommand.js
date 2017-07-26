/**
 * @constructor
 * @struct
 * @param {Function} View The View to show.
 * @param {string|Object} [data]
 */
function ShowViewCommand(View, data) {
    'use strict';

    /**
     * @type {string}
     */
    this.type='ShowViewCommand';

    /**
     * @type {Function}
     */
    this.ViewConstructor = View;

    /**
     * @type {string|Object}
     */
    this.data = data || null;
}

module.exports = ShowViewCommand;
