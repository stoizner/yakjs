'use strict';

const fs = require('fs');
const path = require('path');
const Logger = require('../infrastructure/logger');
const CommandPreset = require('./commandPreset');
const magicNumbers = require('../util/magicNumbers');
const fileExtension = require('../infrastructure/fileExtension');

/**
 * @constructor
 * @struct
 */
function CommandPresetProvider() {
    /**
     * @type {!CommandPresetProvider}
     */
    const self = this;

    /**
     * @type {string}
     */
    const COMMAND_PRESETS_DIRECTORY = './commandPresets/';

    /**
     * @type {!Logger}
     */
    const log = new Logger(self.constructor.name);

    /**
     * @param {CommandPreset} commandPreset
     */
    this.createOrUpdate = function createOrUpdate(commandPreset) {
        let filename = getFilename(commandPreset.name);
        log.info('createOrUpdate command preset', {filename: commandPreset.name});
        fs.writeFileSync(filename, JSON.stringify(commandPreset, null, magicNumbers.JSON_SPACE), {encoding: 'utf8'});
    };

    /**
     * @param {string} presetName
     */
    this.deletePreset = function deletePreset(presetName) {
        let filename = getFilename(presetName);
        fs.unlinkSync(filename);
    };

    /**
     * @returns {!Array<string>} List of all available command presets.
     */
    this.getAllPresetNames = function getAllPresetNames() {
        let presetFilenames = fs.readdirSync(COMMAND_PRESETS_DIRECTORY);
        return presetFilenames.map(filename => path.basename(filename, fileExtension.COMMAND_PRESET_EXTENSION));
    };

    /**
     * @returns {!Array<!CommandPreset>}
     */
    this.getAllPresets = function getAllPresets() {
        return self.getAllPresetNames().map(self.getPreset) || [];
    };

    /**
     * @param {string} presetName
     * @returns {boolean}
     */
    this.exists = function exists(presetName) {
        let filename = getFilename(presetName);
        return fs.existsSync(filename);
    };

    /**
     * @param {string} presetName
     */
    this.getPreset = function getPreset(presetName) {
        let filename = getFilename(presetName);
        let fileContent = fs.readFileSync(filename, 'utf8');
        let preset = Object.assign(new CommandPreset(), JSON.parse(fileContent));

        return preset;
    };

    /**
     * @param {!FileContainer} fileContainer
     * @returns {!Promise}
     */
    this.upload = function upload(fileContainer) {
        return new Promise((resolve, reject) => {
            try {
                let preset = Object.assign(new CommandPreset(), JSON.parse(fileContainer.content));
                preset.name = path.basename(fileContainer.filename, fileExtension.COMMAND_PRESET_EXTENSION);
                self.createOrUpdate(preset);
                resolve();
            } catch (ex) {
                log.warn(ex);
                reject('Can not create preset.');
            }
        });
    };

    /**
     * @param {string} presetName
     * @returns {string}
     */
    function getFilename(presetName) {
        return COMMAND_PRESETS_DIRECTORY + presetName + fileExtension.COMMAND_PRESET_EXTENSION;
    }
}

module.exports = CommandPresetProvider;
