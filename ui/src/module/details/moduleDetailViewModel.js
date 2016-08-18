/**
 * @constructor
 * @param {!yak.ui.ViewModelContext} context
 */
yak.ui.ModuleDetailViewModel = function ModuleDetailViewModel(context) {
    'use strict';

    /**
     * @type {!yak.ui.ModuleDetailViewModel}
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

    /**
     * Deletes the module.
     */
    this.deleteModule = function deleteModule() {
        var request = new yak.api.DeleteModuleRequest();
        request.moduleName = self.moduleName;
        context.adapter.sendRequest(request, showModuleListView);
    };

    function showModuleListView() {
        context.eventBus.post(new yak.ui.ShowViewCommand(yak.ui.ModuleListView));
    }
};
