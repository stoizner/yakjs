var CommandListItem = require('./commandListItem');
var CommandDetailView = require('../edit/commandDetailView');
var ShowViewCommand = require('../../workspace/showViewCommand');
var magicNumbers = require('../../../../server/core/util/magicNumbers');

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
     * @type {!Array<!CommandListItem>}
     */
    this.items = [];

    /**
     * @type {!Array<{groupName:string}>}
     */
    this.groups = [];

    /**
     * @type {Function}
     */
    this.onItemsChanged = _.noop;

    function constructor() {
        console.log('CommandListViewModel.constructor');
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('CommandListViewModel.active');
        loadCommandPresets();
    };

    /**
     * @param {string} name
     */
    this.deleteCommand = function deleteCommand(name) {
        context.adapter.deleteResource('/commands/' + name).then(self.reload);
    };

    /**
     * @param {string} [commandId]
     */
    this.openCommandDetailPanel = function openCommandDetailPanel(commandId) {
        if (commandId) {
            var item = allItems.find(matchCommandId(commandId));

            if (item) {
                context.eventBus.post(new ShowViewCommand(CommandDetailView, item));
            }
        }
    };

    this.reload = function reloadAndRefreshList() {
        loadCommandPresets();
    };

    /**
     * @param {string} commandId
     */
    this.runCommand = function runCommand(commandId) {
        var item = allItems.find(matchCommandId(commandId));

        if(item.isPreset) {
            context.adapter.get('/commands/presets/' + item.commandPresetName + '/execute');
        } else if (item.commandName) {
            context.adapter.post('/commands/' + item.commandName + '/execute', item.exampleData);
        }
    };

    this.activateCommandFilter = function activateCommandFilter() {
        self.items = allItems.filter(function(item) {
            return !item.isPreset;
        });
        self.onItemsChanged(self.items);
    };

    this.activatePresetFilter = function activatePresetFilter() {
        self.items = allItems;
        self.onItemsChanged(self.items);
    };

    this.activateGroupFilter = function activateGroupFilter(groupName) {
        self.items = allItems.filter(function(item) {
            return item.groupName === groupName;
        });
        self.onItemsChanged(self.items);
    };

    function loadCommandPresets() {
        allItems = [];
        self.items = [];
        self.onItemsChanged();

        Promise.all([
            context.adapter.get('/commands/presets').then(extractPresetsFromResponse).then(addPresetsAsListItem),
            context.adapter.get('/commands').then(extractCommands).then(addCommandsAsListItem)
        ])
        .then(function() {
            allItems = allItems.sort(byProperty('displayName'));
            self.groups = findGroups(allItems).sort(byProperties(['icon', 'groupName']));
            self.items = allItems;
            self.onItemsChanged(self.items);
        });
    }

    /**
     * @param {!Array<!!CommandListItem>} items
     * @returns {!Array<{groupName: string>}
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
        allItems = allItems.concat(presets.map(function toItem(preset) {
            var item = new CommandListItem(preset.name);
            item.displayName = preset.displayName || preset.commandName;
            item.description = preset.description;
            item.commandPresetName = preset.name;
            item.commandName = preset.commandName;
            item.commandData = JSON.stringify(preset.commandData, null, magicNumbers.JSON_SPACE);
            item.originalCommandPresetName = preset.name;
            item.isPreset = true;
            item.groupName = preset.groupName;
            return item;
        }));
    }

    /**
     * @param {{commands: Array<!CommandInfo>}} response
     * @return {!Array<!CommandInfo>}
     */
    function extractCommands(response) {
        return response.commands || [];

    }

    /**
     * @param  {!Array<!CommandInfo>} commandInfo
     */
    function addCommandsAsListItem(commandInfo) {
        allItems = allItems.concat(commandInfo.map(function toItem(command) {
            var item = new CommandListItem();
            item.commandName = command.name;
            item.displayName = command.name;
            item.description = command.description;
            item.exampleData = JSON.stringify(command.exampleData, null, magicNumbers.JSON_SPACE);
            item.isPreset = false;
            item.pluginId = command.pluginId;
            return item;
        }));
    }

    /**
     * @param {string} commandId
     * @returns {function(!CommandListItem):boolean}
     */
    function matchCommandId(commandId) {
        return function(item) {
            return item.commandId === commandId;
        }
    }

    /**
     * @param {string} propertyName
     * @returns {function(T, T)}
     * @template T
     */
    function byProperty(propertyName) {
        /**
         * @param {T} leftItem
         * @param {T} rightItem
         * @returns {number}
         * @template T
         */
        return function(leftItem, rightItem) {
            return leftItem[propertyName].localeCompare(rightItem[propertyName]);
        }
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

