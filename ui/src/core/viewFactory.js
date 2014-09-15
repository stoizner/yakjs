/**
 * ViewContext
 * @constructor
 * @param {yak.ui.ViewContext} viewContext
 * @param {yak.ui.ViewModelContext} viewModelContext
 */
yak.ui.ViewFactory = function ViewFactory(viewContext, viewModelContext) {
    'use strict';

    /**
     * Preserve instance.
     * @type {yak.ui.ViewFactory}
     */
    var self = this;

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
};