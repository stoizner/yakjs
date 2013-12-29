/**
 * InstanceView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.InstanceViewModel} viewModel
 */
yak.ui.InstanceView = function InstanceView(parent, context, viewModel) {
    'use strict';

    /**
     *  @type {yak.ui.InstanceView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('panelInstanceEdit');

    this.activate = viewModel.activate;

    this.name = context.ko.observable('');
    this.port = context.ko.observable('');
    this.description = context.ko.observable('');
    this.pluginsCsv = context.ko.observable('');

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceView.constructor', self);
        parent.html(template.build());

        //$('#instance-save', parent).click(handleSaveClick);

        viewModel.onInstanceInfoChanged = handleInstanceInfoChanged;
        context.ko.applyBindings(self, parent[0]);
    }

    /**
     * Handle Instance Info Changed event.
     */
    function handleInstanceInfoChanged() {
        console.log('InstanceView.handleInstanceInfoChanged', viewModel.instanceItem);

        if (viewModel.instanceItem) {
            self.name(viewModel.instanceItem.name);
            self.description(viewModel.instanceItem.description);
            self.port(viewModel.instanceItem.port);
            self.pluginsCsv(viewModel.instanceItem.pluginsCsv);
        } else {
            self.name('');
            self.description('');
            self.port('');
            self.pluginsCsv('');
        }
    }

    /**
     * Handle Save Button Click
     */
    this.handleSaveClick = function handleSaveClick() {
        var instanceItem = new yak.ui.InstanceItem();
        instanceItem.name = self.name();
        instanceItem.description = self.description();
        instanceItem.port = self.port();
        instanceItem.pluginsCsv = self.pluginsCsv();

        viewModel.createOrUpdate(instanceItem);
    };


    /**
     * Handle cancel button click
     */
    this.handleCancelClick = function handleCancelClick() {
        viewModel.cancel();
    };

    constructor();
};