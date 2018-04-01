var CommandListItem = require('./commandListItem');
var CommandDetailView = require('../edit/commandDetailView');
var ShowViewCommand = require('../../workspace/showViewCommand');
var Subject = require('../../core/subject');
var ListItem = require('../../core/listItem');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function CommandListViewModel(context) {
    'use strict';

    /**
     * @type {!CommandListViewModel}
     */
    var self = this;

    /**
     * @type {!Array<!CommandListItem>}
     */
    var allItems = [];

    /**
     * @type {!Subject<!Array<!CommandListItem>>}
     */
    this.items = new Subject([]);

    /**
     * @type {!Array<{groupName:string}>}
     */
    this.groups = [];

    function constructor() {
        console.log('CommandListViewModel.constructor');
    }

    this.activate = function activate() {
        console.log('CommandListViewModel.active');
        loadCommandPresets();
    };

    /**
     * @param {string} [itemId]
     */
    this.openCommandDetailPanel = function openCommandDetailPanel(itemId) {
        context.eventBus.post(new ShowViewCommand(CommandDetailView, itemId));
    };

    this.reload = function reloadAndRefreshList() {
        loadCommandPresets();
    };

    /**
     * @param {string} itemId
     */
    this.runCommandPreset = function runCommandPreset(itemId) {
        context.adapter.get('/commands/presets/' + itemId + '/execute');
    };

    this.clearFilter = function clearFilter() {
        self.items.set(allItems);
    };

    this.activateGroupFilter = function activateGroupFilter(groupName) {
        self.items.set(allItems.filter(function(item) {
            return item.groupName === groupName;
        }));
    };

    function loadCommandPresets() {
        allItems = [];
        self.items.set([]);

        context.adapter.get('/commands/presets')
            .then(extractPresetsFromResponse)
            .then(addPresetsAsListItem)
            .then(() => {
                allItems = allItems.sort(ListItem.compare);
                self.groups = findGroups(allItems).sort(byProperties(['icon', 'groupName']));
                self.items.set(allItems);
            });
    }

    /**
     * @param {!Array<!!CommandListItem>} items
     * @returns {!Array<{groupName: string}>}
     */
    function findGroups(items) {
        var groups = [];
        var groupIndex = {};

        var groupIcons = {
            '*': 'icon-star',
            'fav': 'icon-favorite',
            'frq': 'icon-duck'
        };

        items.forEach(function(item) {
            var groupName = item.groupName;
            if (groupName && !groupIndex[groupName]) {
                var group = {
                    groupName: groupName,
                    icon: groupIcons[groupName] || null
                };
                groupIndex[groupName] = group;
                groups.push(group);
            }
        });

        return groups;
    }

    /**
     * @param {{presets: Array<!CommandPreset>}} response
     * @return {!Array<!CommandPreset>}
     */
    function extractPresetsFromResponse(response) {
        return response.presets || [];
    }

    /**
     * @param {!Array<!CommandPreset>} presets
     */
    function addPresetsAsListItem(presets) {
        allItems = allItems.concat(presets.map(preset => new CommandListItem(
            preset.name,
            preset.displayName,
            preset.commandName,
            preset.groupName)
        ));
    }

    /**
     * @param {Array<string>} propertyNames
     * @returns {function(T, T)}
     * @template T
     */
    function byProperties(propertyNames) {
        /**
         * @param {T} leftItem
         * @param {T} rightItem
         * @returns {number}
         * @template T
         */
        return function(leftItem, rightItem) {
            return propertyNames.reduce(function(sortIndex, propertyName) {
                if (sortIndex !== 0) {
                    var left = leftItem[propertyName];
                    var right = rightItem[propertyName];

                    if (left && !right) {
                        sortIndex = -1;
                    } else if (!left && right) {
                        sortIndex = 1;
                    } else if (left && right) {
                        sortIndex = leftItem[propertyName].localeCompare(rightItem[propertyName]);
                    }
                }

                return sortIndex;
            }, 0);
        }
    }

    constructor();
}

module.exports = CommandListViewModel;

