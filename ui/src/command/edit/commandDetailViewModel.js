var ShowViewCommand = require('../../workspace/showViewCommand');
var CommandListView = require('../list/commandListView');

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
     * @type {CommandListItem}
     */
    this.item = null;

    /**
     * @type {function()}
     */
    this.onItemChanged = _.noop;

    /**
     * @type {boolean}
     */
    this.canBeDeleted = false;

    /**
     * @param {CommandListItem} listItem
     */
    this.activate = function activate(listItem) {
        self.item = Object.assign({}, listItem);
        self.canBeDeleted = self.item.isPreset && self.item.commandPresetName;

        if (!self.item.isPreset) {
            self.item.commandPresetName = self.item.commandName + ' preset';
        }

        self.onItemChanged();
    };

    this.deleteCommandPreset = function deleteCommandPreset() {
        if (self.item.commandPresetName) {
            context.adapter.deleteResource('/commands/presets/' + self.item.commandPresetName).then(self.showCommandListView);
        }
    };

    this.showCommandListView = function showCommandListView() {
        context.eventBus.post(new ShowViewCommand(CommandListView));
    };

    this.runPreset = function runPreset() {
        context.adapter.get('/commands/presets/' + self.item.commandPresetName + '/execute');
    };

    /**
     * @param {Object} commandData
     */
    this.runCommand = function runCommand(commandData) {
        context.adapter.post('/commands/' + self.item.commandName + '/execute', commandData);
    };

    /**
     * @param {CommandListItem} item
     * @returns {!Promise}
     */
    this.saveOrUpdate = function saveOrUpdate(item) {
        var promise = null;
        if (item.originalCommandPresetName) {
            promise = update(item);
        } else {
            promise = create(item);
        }

        return promise;
    };

    /**
     * @param {CommandListItem} item
     * @returns {!Promise}
     */
    function create(item) {
        var request = {
            preset: toPresetApi(item)
        };
        return context.adapter.put('/commands/presets/' + request.preset.name, request);
    }

    /**
     * @param {!CommandListItem} item
     * @returns {!Promise}
     */
    function update(item) {
        var request = {
            preset: toPresetApi(item)
        };
        return context.adapter.put('/commands/presets/' + item.originalCommandPresetName, request);
    }

    /**
     * @param {!CommandListItem} item
     * @returns {CommandPreset} @see {http://www.yakjs.com/api/commands.html#CommandPreset}
     */
    function toPresetApi(item) {
        return {
            name: item.commandPresetName,
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
