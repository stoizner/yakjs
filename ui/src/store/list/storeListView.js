var ExpandFeature = require('../../widgets/expandFeature');

/**
 * @constructor
 * @struct
 * @param {ViewContext} context
 * @param {jQuery} parent
 * @param {StoreListViewModel} viewModel
 */
function StoreListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {!Template}
     */
    var template = context.template.load('storeList');

    /**
     * @type {!Template}
     */
    var nodeItemTemplate = context.template.load('storeNodeItem');

    /**
     * @type {!Template}
     */
    var nodeGroupTemplate = context.template.load('storeNodeGroup');

    /**
     *
     * @type {ExpandFeature}
     */
    var expandFeature = null;

    this.activate = viewModel.activate();

    /**
     * Constructor
     */
    function constructor() {
        console.log('StoreListView.constructor');
        parent.html(template.build());

        parent.find('[data-element=create]').click(function() { viewModel.activateStoreEditPanel(); });
        parent.find('[data-element=refresh]').click(viewModel.reload);

        parent.find('[data-element=expandAll]').click(function() { expandFeature.expandAll(); });
        parent.find('[data-element=collapseAll]').click(function() { expandFeature.collapseAll(); });

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

        expandFeature = new ExpandFeature(treeElement);
        expandFeature.collapseAll();
    }

    /**
     * @param {!StoreNodeItem} node
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
     * @param {!StoreNodeItem} node
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
     * @param {!StoreNodeItem} node
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
}

module.exports = StoreListView;
