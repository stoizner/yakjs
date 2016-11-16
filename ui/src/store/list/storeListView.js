/**
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.StoreListViewModel} viewModel
 */
yak.ui.StoreListView = function StoreListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {!yak.ui.Template}
     */
    var template = context.template.load('storeList');

    /**
     * @type {!yak.ui.Template}
     */
    var nodeItemTemplate = context.template.load('storeNodeItem');

    /**
     * @type {!yak.ui.Template}
     */
    var nodeGroupTemplate = context.template.load('storeNodeGroup');

    /**
     *
     * @type {yak.ui.ExpandFeature}
     */
    var expandFeature = null;

    this.activate = viewModel.activate();

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.StoreListView.constructor');
        parent.html(template.build());

        parent.find('[data-command=create]').click(function() { viewModel.activateStoreEditPanel(); });
        parent.find('[data-command=refresh]').click(viewModel.reloadAndRefreshList);

        parent.find('[data-command=expand-all]').click(function() { expandFeature.expandAll(); });
        parent.find('[data-command=collapse-all]').click(function() { expandFeature.collapseAll(); });

        viewModel.onItemsChanged = handleItemsChanged;

        parent.find('[data-element=tree]').click(handleTreeClick);

        updateTree();
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleTreeClick(event) {
        var listItem = $(event.target).closest('.tree-item[data-key]');
        var storeKey = listItem.attr('data-key');

        if (storeKey) {
            viewModel.activateStoreEditPanel(storeKey);
        }
    }

    function updateTree() {
        var rootNodeHtml = viewModel.rootNode.nodes.map(function(node) {
            return renderNode(node, 0);
        }).join('\n');
        var treeElement = parent.find('[data-element="tree"]');
        treeElement.html(rootNodeHtml);

        expandFeature = new yak.ui.ExpandFeature(treeElement);
        expandFeature.collapseAll();
    }

    /**
     * @param {!yak.ui.StoreNodeItem} node
     * @param {number} level
     * @return {string}
     */
    function renderNode(node, level) {
        var renderer = {
            item: renderNodeItem,
            group: renderNodeGroup
        };

        return renderer[node.type](node, level);
    }

    /**
     * @param {!yak.ui.StoreNodeItem} node
     * @param {number} level
     */
    function renderNodeItem(node, level) {
        var itemContext = {
            name: node.name,
            key: node.key,
            level: level,
            intend: level * 20
        };

        return nodeItemTemplate.build(itemContext);
    }

    /**
     * @param {!yak.ui.StoreNodeItem} node
     * @param {number} level
     * @returns {string}
     */
    function renderNodeGroup(node, level) {

        var groupNodeHtml = node.nodes.map(function(node) {
            var nextIntendLevel = level + 1;
            return renderNode(node, nextIntendLevel);
        }).join('\n');

        var groupContext = {
            name: node.name,
            nodes: groupNodeHtml,
            level: level,
            intend: level * 20
        };

        return nodeGroupTemplate.build(groupContext);
    }

    /**
     * Handle items changed event from view model.
     */
    function handleItemsChanged() {
        updateTree();
    }

    /**
     * @param {string} key
     * @param {string} value
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
