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
    var template = context.template.load('instanceEdit');

    /**
     * @type {yak.ui.Template}
     */
    var pluginListTemplate = context.template.load('selectedPluginsList');

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceView.constructor', self);

        updateView();

        viewModel.onInstanceInfoChanged = updateView;
        viewModel.onSelectPluginItemsChanged = updatePluginList;
        viewModel.onErrorResponse = handleErrorResponse;
    }

    /**
     * View is being activated.
     * @param {?} [data]
     */
    this.activate = function activate(data) {
        parent.find('.error-line').hide();
        viewModel.activate(data);
    };

    /**
     * Updates the view.
     */
    function updateView() {
        var context = {
            instance: viewModel.instanceItem
        };

        parent.html(template.build(context));

        updatePluginList();

        parent.find('[data-command=save]').click(handleSaveCommand);
        parent.find('[data-command=delete]').click(viewModel.deleteInstance);
        parent.find('[data-command=cancel]').click(viewModel.cancel);
        parent.find('[data-list=plugin]').click(handleSelectPluginClick);
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
        parent.find('.error-line').show();
        parent.find('.error-line-text').html(message);
    }

    /**
     * Handle Save Button Click
     */
    function handleSaveCommand() {
        console.warn('save');
        parent.find('.error-line').hide();

        var instanceItem = new yak.ui.InstanceItem(parent.find('[name=name]').val());
        instanceItem.name = parent.find('[name=name]').val();
        instanceItem.description = parent.find('[name=description]').val();
        instanceItem.port = parent.find('[name=port]').val();

        viewModel.createOrUpdate(instanceItem);
    }

    constructor();
};
