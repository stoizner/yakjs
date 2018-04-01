'use strict';

const InstanceDetailsItem = require('./instanceDetailsItem');
const PluginItem = require('./pluginItem');
const ShowViewCommand = require('../../workspace/showViewCommand');
const InstanceListView = require('../list/instanceListView');
const compareName = require('../../core/compare/compareName');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function InstanceViewModel(context) {
    /**
     * @type {!InstanceViewModel}
     */
    let self = this;

    /**
     * @type {InstanceDetailsItem}
     */
    this.instanceDetailsItem = null;

    /**
     * @type {Function}
     */
    this.onInstanceDetailsItemChanged = _.noop;

    /**
     * Callback for received error response.
     * @type {function(string)}
     */
    this.onErrorResponse = _.noop;

    /**
     * Activate view
     * @param {InstanceInfoItem} data
     * @returns {!Promise}
     */
    this.activate = function activate(data) {
        console.log('InstanceViewModel.activate', {data: data});

        if (data) {
            self.instanceDetailsItem = new InstanceDetailsItem();
            self.instanceDetailsItem.id = data.id;
            self.instanceDetailsItem.description = data.description;
            self.instanceDetailsItem.name = data.name;
            self.instanceDetailsItem.port = data.port;
            self.instanceDetailsItem.plugins = data.plugins.map(pluginName => new PluginItem(pluginName, '', true)).sort(compareName);
            self.instanceDetailsItem.filteredPlugins = self.instanceDetailsItem.plugins
        } else {
            self.instanceDetailsItem = new InstanceDetailsItem();
        }

        self.onInstanceDetailsItemChanged();

        // Load all plugins to get extend the plugins with the description.
        return context.adapter.get('/plugins').then(handleGetPluginsResponse);
    };

    /**
     * Delete instance.
     */
    this.deleteInstance = function deleteInstance() {
        context.adapter
            .deleteResource('/instances/' + self.instanceDetailsItem.id + '/config')
            .then(showList)
            .catch(showErrorResponse);
    };

    /**
     * @param {GetPluginsResponse} response
     */
    function handleGetPluginsResponse(response) {
        self.instanceDetailsItem.plugins = response.plugins.map(plugin => {
            let item = self.instanceDetailsItem.plugins.find(item => item.name === plugin.id);

            if (item) {
                item.description = plugin.description;
            } else {
                item = new PluginItem(plugin.id, plugin.description);
            }

            return item;
        });

        self.instanceDetailsItem.plugins.sort(compareName);
        self.instanceDetailsItem.filteredPlugins = self.instanceDetailsItem.plugins;
    }

    /**
     * Create or update a new WebSocket instance.
     * @param {!InstanceDetailsItem} instanceDetailsItem
     */
    this.createOrUpdate = function createOrUpdate(instanceDetailsItem) {
        let request = {
            instanceConfig: {
                id: instanceDetailsItem.id,
                name: instanceDetailsItem.name,
                description: instanceDetailsItem.description,
                port: instanceDetailsItem.port,
                plugins: self.instanceDetailsItem.plugins.filter(item => item.isActive).map(item => item.name)
            }
        };

        let requestPromise;
        let apiUrl;

        if (self.instanceDetailsItem.id) {
            // Update instance API URL.
            apiUrl = '/instances/' + self.instanceDetailsItem.id + '/config';

            requestPromise = context.adapter.put(apiUrl, request);
        } else {
            // Create instance API URL.
            apiUrl = '/instances/config';

            requestPromise = context.adapter.post(apiUrl, request);
        }

        requestPromise
            .then(showList)
            .catch(showErrorResponse);
    };

    /**
     * Cancel instance edit.
     */
    this.cancel = function cancel() {
        showPanelInstanceList();
    };

    /**
     * Uses all available plugins.
     */
    this.useAllPlugins = function useAllPlugins() {
        self.instanceDetailsItem.filteredPlugins.forEach(item => {
            item.isActive = true;
        });

        self.onInstanceDetailsItemChanged();
    };

    /**
     * Don't use any plugin.
     */
    this.useNoPlugins = function useNoPlugins() {
        self.instanceDetailsItem.filteredPlugins.forEach(item => {
            item.isActive = false;
        });

        self.onInstanceDetailsItemChanged();
    };

    /**
     * @param {string} searchText
     */
    this.filterPlugin = function filterPlugin(searchText) {
        if (searchText) {
            self.instanceDetailsItem.filteredPlugins = self.instanceDetailsItem.plugins.filter(item => {
                return JSON.stringify(item).toLowerCase().indexOf(searchText) >= 0;
            });
        } else {
            self.instanceDetailsItem.filteredPlugins = self.instanceDetailsItem.plugins;
        }

        self.onInstanceDetailsItemChanged();
    };

    /**
     * Show the panel instance list.
     */
    function showPanelInstanceList() {
        context.eventBus.post(new ShowViewCommand(InstanceListView));
    }

    /**
     *
     * @param {string} pluginName
     */
    this.togglePluginSelection = function togglePluginSelection(pluginName) {
        let pluginItem = self.instanceDetailsItem.plugins.find(item => item.name === pluginName);
        pluginItem.isActive = !pluginItem.isActive;

        self.onInstanceDetailsItemChanged();
    };

    function showList() {
        context.eventBus.post(new ShowViewCommand(InstanceListView));
    }

    function showErrorResponse(response) {
        self.onErrorResponse(response.message);
    }
}

module.exports = InstanceViewModel;
