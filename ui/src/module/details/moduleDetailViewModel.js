var ShowViewCommand = require('../../workspace/showViewCommand');
var ModuleListView = require('../list/moduleListView');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function ModuleDetailViewModel(context) {
    'use strict';

    /**
     * @type {!ModuleDetailViewModel}
     */
    var self = this;

    /**
     * @type {string}
     */
    this.moduleName = null;

    /**
     * @type {function()}
     */
    this.onItemChanged = _.noop;

    /**
     * Activates view.
     * @param {string} moduleName
     */
    this.activate = function activate(moduleName) {
        self.moduleName = moduleName;
        self.onItemChanged();
    };

    /**
     * Cancel details view.
     */
    this.cancel = function cancel() {
        showModuleListView();
    };

    this.deleteModule = function deleteModule() {
        context.adapter.deleteResource('/modules/' + self.moduleName).then(showModuleListView);
    };

    function showModuleListView() {
        context.eventBus.post(new ShowViewCommand(ModuleListView));
    }
}

module.exports = ModuleDetailViewModel;
