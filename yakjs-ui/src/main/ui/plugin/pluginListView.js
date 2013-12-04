/**
 * PluginListView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {$} parent
 */
yak.ui.PluginListView = function PluginListView(parent, context) {
    'use strict';

    /**
     * @type {yak.ui.PluginListView}
     */
    var self = this;

    var itemTemplate = Mustache.compile($('#plugin-item-tpl').html());

    var itemContainer = $('.plugin-items', parent);

    var listItems = [];

    var contextMenuActions = {};

    /**
     * Constructor
     */
    function constructor() {
        context.eventBus.on(yak.api.GetPluginsResponse).register(handleGetPluginsResponse);
        context.eventBus.on(yak.api.RemovePluginResponse).register(handleRemovePluginResponse);

        contextMenuActions['edit'] = handleContextMenuEdit;
        contextMenuActions['delete'] = handleContextMenuDelete;

        $('#plugin-refresh').click(handleButtonRefreshClick);
        $('#plugin-new').click(function() { context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin-edit')); });
    }

    /**
     * Handle refresh button click
     */
    function handleButtonRefreshClick() {
        context.webSocket.send(new yak.api.GetPluginsRequest());
    }

    /**
     * Activate View
     */
    this.active = function active() {
        context.webSocket.send(new yak.api.GetPluginsRequest());
    };

    /**
     * @param {yak.api.GetPluginsResponse} response
     */
    function handleGetPluginsResponse(response) {
        console.log('handleGetPluginsResponse', response);

        listItems = response.plugins;
        self.update();
    }

    /**
     * @param {yak.RemovePluginResponse} response
     */
    function handleRemovePluginResponse(response) {
        console.log('handleRemovePluginResponse', response);
        context.webSocket.send(new yak.api.GetPluginsRequest());
    }

    /**
     * Update panel list
     */
    this.update = function update() {

        var html = '';

        listItems.sort(yak.ui.nameCompare);

        for(var i=0; i<listItems.length; i++) {
            html += itemTemplate(listItems[i]);
        }

        itemContainer.html(html);

        $('.plugin-item', itemContainer).contextMenu($('#plugin-item-context'), handleMenuClicked);
    };

    /**
     * @param event
     * @param context
     */
    function handleMenuClicked(context, event) {

        var pluginName = context.attr('data-plugin');
        var menuAction = $(event.target).attr('data-menu');

        if (contextMenuActions.hasOwnProperty(menuAction)) {
            contextMenuActions[menuAction](pluginName);
        } else {
            console.warn('No context menu handler found for ' + menuAction);
        }
    }

    /**
     * @param pluginName
     */
    function handleContextMenuEdit(pluginName) {
        var pluginInfo = null;

        for(var i=0; i<listItems.length; i++) {
            if (listItems[i].name === pluginName) {
                pluginInfo = listItems[i];
                break;
            }
        }

        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin-edit', pluginInfo));
    }

    /**
     * @param {string} pluginName
     */
    function handleContextMenuDelete(pluginName) {
        var request = new yak.api.RemovePluginRequest();
        request.pluginName = pluginName;
        context.webSocket.send(request);
    }

    constructor();
};