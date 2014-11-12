/**
 * StoreListView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.StoreListViewModel} viewModel
 */
yak.ui.StoreListView = function StoreListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.StoreListView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('storeList');

    /**
     * @type {yak.ui.Template}
     */
    var itemTemplate = context.template.load('storeListItem');

    var contextMenuActions = {};

    this.handleRefreshClick = function handleRefreshClick() { viewModel.reloadAndRefreshList(); };
    this.handleNewStoreItemClick = function handleNewStoreItemClick() { viewModel.activateStoreEditPanel(); };
    this.activate = function activate() { viewModel.activate(); };

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.StoreListView.constructor');
        parent.html(template.build());

        viewModel.onItemsChanged = handleItemsChanged;

        contextMenuActions.edit = handleContextMenuEdit;
        contextMenuActions.delete = viewModel.deleteEntry;
        contextMenuActions.saveAsFile = handleSaveAsFileClick;

        context.ko.applyBindings(self, parent[0]);
        self.createList();
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleFileDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.originalEvent.dataTransfer.dropEffect = 'copy';

        fileDropZone.addClass('state-drag-over');
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleFileDragLeave(event) {
        fileDropZone.removeClass('state-drag-over');
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleFileDrop(event) {
        console.log('handleFileDrop', { event: event });
        fileDropZone.removeClass('state-drag-over');

        event.stopPropagation();
        event.preventDefault();

        var files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files;
        console.log(files);

        _.each(files, function(file) {

            if (file.type.match('text/plain')) {
                console.log('file uploaded', file);
                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    return function(e) {
                        var fileName = file.name;
                        var storeItem = new yak.ui.StoreItem();

                        storeItem.key = fileName.substr(0, fileName.lastIndexOf('.')).trim();
                        storeItem.value = e.target.result;
                        viewModel.createOrUpdate(storeItem);
                    };
                })(file);

                // Read in the image file as a data URL.
                reader.readAsText(file);
            } else {
                console.warn('Drop only text files...' + file.type);
            }
        });
    }

    /**
     * Create the instance list.
     */
    this.createList = function createList() {

        var html = '';
        var itemContainer = $('.store-items', parent);

        // viewModel.items.sort(yak.ui.nameCompare);

        _.each(viewModel.items, function(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);

        $('.list-item-open-context', itemContainer).contextMenu($('#store-item-context'), handleMenuClicked);
    };

    /**
     * Handle items changed event from view model.
     */
    function handleItemsChanged() {
        self.createList();
    }

    /**
     * @param key
     */
    function handleContextMenuEdit(key) {
        var contextItem = _.findWhere(viewModel.items, { key: key});
        viewModel.activateStoreEditPanel(contextItem);
    }

    /**
     * @param context
     * @param event
     */
    function handleMenuClicked(context, event) {

        var key = context.closest('.list-item').attr('data-key');
        var menuAction = $(event.target).attr('data-menu');

        if (contextMenuActions.hasOwnProperty(menuAction)) {
            contextMenuActions[menuAction](key);
        } else {
            console.warn('No context menu handler found for ' + menuAction);
        }
    }

    /**
     *
     * @param key
     */
    function handleSaveAsFileClick(key) {
        viewModel.getValue(key, handleSaveAsFile);
    }

    /**
     *
     * @param key
     * @param value
     */
    function handleSaveAsFile(key, value) {
        var downloadLink = document.createElement('a');
        downloadLink.href = 'data:application/text,' + encodeURIComponent(value);
        downloadLink.download = key + '.txt';
        downloadLink.target = '_blank';
        downloadLink.click();
    }

    constructor();
};
