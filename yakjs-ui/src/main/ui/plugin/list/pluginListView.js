/**
 * PluginListView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.PluginListViewModel} viewModel
 */
yak.ui.PluginListView = function PluginListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.PluginListView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('panelPlugins');

    /**
     * @type {yak.ui.Template}
     */
    var itemTemplate = context.template.load('pluginItem');

    var contextMenuActions = {};

    /**
     * @type {jQuery}
     */
    var fileDropZone = null;

    this.handleNewPluginClick = function() { viewModel.activatePluginEditPanel(); };
    this.handleRefreshClick = function() { viewModel.reloadAndRefreshList(); };
    this.activate = function() { viewModel.activate(); };

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.PluginListView.constructor');
        parent.html(template.build());

        fileDropZone = $('.drop-file');

        contextMenuActions.edit = handleContextMenuEdit;
        contextMenuActions.delete = viewModel.deletePlugin;
        contextMenuActions.saveAsJavaScriptFile = handleSaveAsJavaScriptFile;

        viewModel.onItemsChanged = function() { self.createList(); };

        context.ko.applyBindings(self, parent[0]);
        self.createList();

        fileDropZone.bind('drop', handleJsFileDrop);
        fileDropZone.bind('dragover', handleJsFileDragOver);
        fileDropZone.bind('dragleave', handleJsFileDragLeave);
    }

    /**
     * @param event
     */
    function handleJsFileDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.originalEvent.dataTransfer.dropEffect = 'copy';

        fileDropZone.addClass('state-drag-over');
    }

    /**
     * @param event
     */
    function handleJsFileDragLeave(event) {
        fileDropZone.removeClass('state-drag-over');
    }

    /**
     * @param event
     */
    function handleJsFileDrop(event) {
        console.log('handleJsFileDrop', event);
        fileDropZone.removeClass('state-drag-over');

        event.stopPropagation();
        event.preventDefault();

        var files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files;
        console.log(files);

        _.each(files, function(file) {

            if (file.type.match('application/javascript')) {
                console.log('file uploaded', file);
                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    return function(e) {
                        var fileName = file.name;
                        var content = e.target.result;
                        var pluginName = fileName.substr(0, fileName.lastIndexOf('.js')).trim();
                        console.log({pluginName: pluginName, fileName: fileName, content: content});

                        viewModel.createOrUpdatePlugin(pluginName, content);
                    };
                })(file);

                // Read in the image file as a data URL.
                reader.readAsText(file);
            } else {
                console.warn('Drop only JavaScript files with *.js ending.');
            }
        });
    }

    /**
     * Update panel list
     */
    this.createList = function createList() {

        var html = '';
        var itemContainer = $('.plugin-items', parent);

        viewModel.items.sort(yak.ui.nameCompare);

        _.each(viewModel.items, function(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);

        $('.list-item-open-context', itemContainer).contextMenu($('#plugin-item-context'), handleMenuClicked);
    };

    /**
     * @param event
     * @param context
     */
    function handleMenuClicked(context, event) {

        var pluginName = context.closest('.list-item').attr('data-plugin');
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
        var contextItem = _.findWhere(viewModel.items, { name: pluginName});
        viewModel.activatePluginEditPanel(contextItem);
    }

    /**
     * @param pluginName
     */
    function handleSaveAsJavaScriptFile(pluginName) {
        var contextItem = _.findWhere(viewModel.items, { name: pluginName});

        var downloadLink = document.createElement('a');
        downloadLink.href = 'data:application/json,' + encodeURIComponent(contextItem.code);
        downloadLink.download = pluginName + '.js';
        downloadLink.target = '_blank';
        downloadLink.click();
    }

    /**
     * Show and activate the plugin edit panel.
     * @param {yak.ui.PluginItem} [item]
     */
    this.activatePluginEditPanel = function activatePluginEditPanel(item) {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin-edit', item));
    };

    constructor();
};