/**
 * @constructor
 * @struct
 * @param {!ViewContext} viewContext
 * @param {!ViewModelContext} viewModelContext
 */
function ViewFactory(viewContext, viewModelContext) {
    'use strict';

    /**
     * Create a new View an place it to its parent container.
     * @param {$} parent
     * @param {Function} ViewModelConstructor
     * @param {Function} ViewConstructor
     * @return {*} View
     */
    this.create = function create(parent, ViewConstructor, ViewModelConstructor) {

        var viewModel = new ViewModelConstructor(viewModelContext);
        return new ViewConstructor(parent, viewContext, viewModel);
    };
}

module.exports = ViewFactory;
