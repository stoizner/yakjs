/**
 * @constructor
 * @struct
 * @param {Function} View The View to show.
 * @param {string|T} [data]
 * @template T
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
     * @type {string|T}
     */
    this.data = data || null;
}

module.exports = ShowViewCommand;
