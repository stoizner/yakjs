var ShowViewCommand = require('../../workspace/showViewCommand');
var CommandListView = require('../list/commandListView');
var CommandDetailsItem = require('./commandDetailsItem');
var Subject = require('../../core/subject');
var SelectableListItem = require('../../core/selectableListItem');
var magicNumbers = require('../../../../server/src/util/magicNumbers');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function CommandDetailViewModel(context) {
    'use strict';

    /**
     * @type {!CommandDetailViewModel}
     */
    var self = this;

    /**
     * @type {!Array<Object>}
     */
    var availableCommands = [];

    /**
     * @type {!Subject<CommandDetailsItem>}
     */
    this.item = new Subject(null);

    /**
     * @type {!Subject<!Array<!SelectableListItem>>}
     */
    this.commandItems = new Subject([]);

    /**
     * @type {!Subject<!Array<!SelectableListItem>>}
     */
    this.pluginItems = new Subject([]);

    /**
     * @param {?string} presetName
     */
    this.activate = function activate(presetName) {
        if (presetName) {
            context.adapter
                .get('/commands/presets')
                .then(response => response.presets.find(preset => preset.name === presetName))
                .then(preset => {
                    var detailsItem = new CommandDetailsItem(preset.name);
                    detailsItem.displayName = preset.displayName;
                    detailsItem.groupName = preset.groupName;
                    detailsItem.commandName = preset.commandName;
                    detailsItem.commandData = preset.commandData ? JSON.stringify(preset.commandData, null, magicNumbers.JSON_SPACE) : '';
                    detailsItem.pluginId = preset.pluginId;

                    self.item.set(detailsItem);

                    context.adapter.get('/commands/').then(handleCommands);
                });
        } else {
            self.item.set(null);
            context.adapter.get('/commands/').then(handleCommands);
        }
    };

    this.deleteCommandPreset = function deleteCommandPreset() {
        if (self.item.value.presetName) {
            context.adapter.deleteResource('/commands/presets/' + self.item.value.presetName).then(self.showCommandListView);
        }
    };

    this.showCommandListView = function showCommandListView() {
        context.eventBus.post(new ShowViewCommand(CommandListView));
    };

    /**
     * @param {Object} commandData
     */
    this.runCommand = function runCommand(commandData) {
        context.adapter.post('/commands/' + self.item.value.commandName + '/execute', commandData);
    };

    /**
     * @param {CommandDetailsItem} item
     * @returns {!Promise}
     */
    this.saveOrUpdate = function saveOrUpdate(item) {
        var promise = null;
        if (self.item.value) {
            promise = update(item);
        } else {
            promise = create(item);
        }

        return promise;
    };

    /**
     * @param {string} pluginId
     */
    this.selectPlugin = function selectPlugin(pluginId) {
        if (pluginId) {
            updateCommandItems(command => command.pluginId === pluginId);
            self.pluginItems.change(self.pluginItems.value.map(item => {
                item.isSelected = item.id === pluginId;
                return item;
            }));
        } else {
            updateCommandItems();
            self.pluginItems.change(self.pluginItems.value.map(item => {
                item.isSelected = false;
                return item;
            }));
        }
    };

    /**
     * @param {Object} response
     */
    function handleCommands(response) {
        availableCommands = response.commands;

        updateCommandItems();
        updatePluginItems();
    }

    /**
     * @param {function(object):boolean} [filterCallback]
     */
    function updateCommandItems(filterCallback) {
        var commands = filterCallback ? availableCommands.filter(filterCallback) : availableCommands;
        var commandItems = commands.map(commandInfo => new SelectableListItem(commandInfo.name, commandInfo.displayName));
        commandItems.sort(SelectableListItem.compare);

        if (self.item.value) {
            commandItems.forEach(item => {
                item.isSelected = item.id === self.item.value.commandName;
            });
        }

        self.commandItems.set(commandItems);
    }

    function updatePluginItems() {
        var pluginItems = availableCommands.map(commandInfo => new SelectableListItem(commandInfo.pluginId, commandInfo.pluginId));
        pluginItems = _.unique(pluginItems);
        pluginItems.sort(SelectableListItem.compare);

        // Add a select all item to the top.
        pluginItems.unshift(new SelectableListItem(null, 'Any plugin'));

        self.pluginItems.set(pluginItems);
    }

    /**
     * @param {CommandDetailsItem} item
     * @returns {!Promise}
     */
    function create(item) {
        var request = {
            preset: toPresetApi(item)
        };
        return context.adapter.put('/commands/presets/' + request.preset.name, request);
    }

    /**
     * @param {!CommandDetailsItem} item
     * @returns {!Promise}
     */
    function update(item) {
        var request = {
            preset: toPresetApi(item)
        };
        return context.adapter.put('/commands/presets/' + self.item.value.presetName, request);
    }

    /**
     * @param {!CommandDetailsItem} item
     * @returns {CommandPreset} @see {http://www.yakjs.com/api/commands.html#CommandPreset}
     */
    function toPresetApi(item) {
        return {
            name: item.presetName,
            displayName: item.displayName,
            groupName: item.groupName,
            commandName: item.commandName,
            commandData: parseCommandData(item.commandData)
        }
    }

    /**
     * Parses the command data json.
     * @param {?string} json
     * @returns {Object}
     */
    function parseCommandData(json) {
        var parsedObject = null;
        try {
            if (json) {
                parsedObject = JSON.parse(json);
            }
        } catch (ex) {
            throw new Error('Command data is not a valid JSON.');
        }

        return parsedObject;
    }

}

module.exports = CommandDetailViewModel;
