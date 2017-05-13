var InstanceConfigItem = require('./instanceConfigItem');

/**
 * @constructor
 * @param {ViewContext} context
 * @param {jQuery} parent
 * @param {InstanceViewModel} viewModel
 */
function InstanceView(parent, context, viewModel) {
    'use strict';

    /**
     *  @type {InstanceView}
     */
    var self = this;

    /**
     * @type {Template}
     */
    var template = context.template.load('instanceEdit');

    /**
     * @type {Template}
     */
    var pluginListTemplate = context.template.load('selectedPluginsList');

    /**
     * Constructor
     */
    function constructor() {
        console.log('InstanceView.constructor', self);

        updateView();

        viewModel.onInstanceConfigItemChanged = updateView;
        viewModel.onSelectPluginItemsChanged = updatePluginList;
        viewModel.onErrorResponse = handleErrorResponse;
    }

    /**
     * View is being activated.
     * @param {?} [data]
     */
    this.activate = function activate(data) {
        viewModel.activate(data);
    };

    /**
     * Updates the view.
     */
    function updateView() {
        var context = {
            instance: viewModel.instanceConfigItem
        };

        parent.html(template.build(context));

        updatePluginList();

        parent.find('[data-command=save]').click(handleSaveCommand);
        parent.find('[data-command=delete]').click(viewModel.deleteInstance);
        parent.find('[data-command=cancel]').click(viewModel.cancel);
        parent.find('[data-list=plugin]').click(handleSelectPluginClick);
        parent.find('[data-command=plugins-all]').click(viewModel.useAllPlugins);
        parent.find('[data-command=plugins-none]').click(viewModel.useNoPlugins);
    }

    function updatePluginList() {
        var context = {
            allPlugins: viewModel.allPluginItems,
            selectedPluginItems: viewModel.selectedPluginItems,
            notSelectedPluginItems: viewModel.notSelectedPluginItems
        };

        parent.find('[data-list=plugin]').html(pluginListTemplate.build(context));
    }

    /**
     * @param {?} event
     */
    function handleSelectPluginClick(event) {
        var plugin = $(event.target).closest('.select-plugin-item');
        var pluginName = plugin.attr('data-plugin-name');

        viewModel.togglePluginSelection(pluginName);
    }

    /**
     * @param {string} message
     */
    function handleErrorResponse(message) {
        var errorMessageElement = parent.find('[data-element=error-message]');
        errorMessageElement.show();
        errorMessageElement.find('.warning-text').html(message);
    }

    /**
     * Handle Save Button Click
     */
    function handleSaveCommand() {
        parent.find('[data-element=error-message]').hide();

        var item = new InstanceConfigItem();
        item.id = parent.find('[name=name]').val();
        item.name = parent.find('[name=name]').val();
        item.description = parent.find('[name=description]').val();
        item.port = parent.find('[name=port]').val();

        viewModel.createOrUpdate(item);
    }

    constructor();
}

module.exports = InstanceView;
