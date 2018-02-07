const InstanceDetailsItem = require('./instanceDetailsItem');

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
    var pluginItemListTemplate = context.template.load('pluginItemList');

    function constructor() {
        viewModel.onInstanceDetailsItemChanged = updatePluginList;
        viewModel.onErrorResponse = handleErrorResponse;
    }

    /**
     * View is being activated.
     * @param {?} [data]
     */
    this.activate = function activate(data) {
        viewModel.activate(data).then(updateView);
    };

    /**
     * Updates the view.
     */
    function updateView() {
        var context = {
            instance: viewModel.instanceDetailsItem
        };

        parent.html(template.build(context));

        updatePluginList();

        var searchInput = parent.find('[data-element=pluginSearchInput]');
        searchInput.on('input propertychange paste', handlePluginSearchInputChange);

        parent.find('[data-element=save]').click(handleSaveCommand);
        parent.find('[data-element=delete]').click(viewModel.deleteInstance);
        parent.find('[data-element=cancel]').click(viewModel.cancel);
        parent.find('[data-element=pluginList]').click(handlePluginItemClick);
        parent.find('[data-element=selectAllButton]').click(viewModel.useAllPlugins);
        parent.find('[data-element=selectNoneButton]').click(viewModel.useNoPlugins);
        parent.find('[data-element=clearSearchButton]').click(() => {
            searchInput.val('');
            viewModel.filterPlugin(null);
        });
    }

    function updatePluginList() {
        parent.find('[data-element=pluginList]').html(pluginItemListTemplate.build(viewModel.instanceDetailsItem));
    }

    /**
     * @param {?} event
     */
    function handlePluginItemClick(event) {
        var plugin = $(event.target).closest('[data-element=pluginItem]');
        var pluginName = plugin.attr('data-name');

        viewModel.togglePluginSelection(pluginName);
    }

    /**
     * @param {string} message
     */
    function handleErrorResponse(message) {
        var errorMessageElement = parent.find('[data-element=errorMessage]');
        errorMessageElement.show();
        errorMessageElement.find('.warning-text').html(message);
    }

    /**
     * Handle Save Button Click
     */
    function handleSaveCommand() {
        parent.find('[data-element=errorMessage]').hide();

        var item = new InstanceDetailsItem();
        item.id = parent.find('[name=name]').val();
        item.name = parent.find('[name=name]').val();
        item.description = parent.find('[name=description]').val();
        item.port = parent.find('[name=port]').val();

        viewModel.createOrUpdate(item);
    }

    function handlePluginSearchInputChange(event) {
        viewModel.filterPlugin(event.currentTarget.value);
    }

    constructor();
}

module.exports = InstanceView;
