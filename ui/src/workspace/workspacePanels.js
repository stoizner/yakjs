'use strict';

var InstanceListView = require('../instance/list/instanceListView');
var InstanceListViewModel = require('../instance/list/instanceListViewModel');
var InstanceView = require('../instance/edit/instanceView');
var InstanceViewModel = require('../instance/edit/instanceViewModel');

var PluginListView = require('../plugin/list/pluginListView');
var PluginListViewModel = require('../plugin/list/pluginListViewModel');
var PluginView = require('../plugin/edit/pluginView');
var PluginViewModel = require('../plugin/edit/pluginViewModel');

var StoreListView = require('../store/list/storeListView');
var StoreListViewModel = require('../store/list/storeListViewModel');
var EditStoreItemView = require('../store/edit/editStoreItemView');
var EditStoreItemViewModel = require('../store/edit/editStoreItemViewModel');

var ModuleListView = require('../module/list/moduleListView');
var ModuleListViewModel = require('../module/list/moduleListViewModel');
var ModuleDetailView = require('../module/details/moduleDetailView');
var ModuleDetailViewModel = require('../module/details/moduleDetailViewModel');

var CommandListView = require('../command/list/commandListView');
var CommandListViewModel = require('../command/list/commandListViewModel');
var CommandDetailView = require('../command/edit/commandDetailView');
var CommandDetailViewModel = require('../command/edit/commandDetailViewModel');

var FileUploadView = require('../fileUpload/fileUploadView');
var FileUploadViewModel = require('../fileUpload/fileUploadViewModel');

var ServerConfigView = require('../serverConfig/serverConfigView');
var ServerConfigViewModel = require('../serverConfig/serverConfigViewModel');

var panels = {};

register(InstanceListView, InstanceListViewModel);
register(InstanceView, InstanceViewModel);
register(PluginListView, PluginListViewModel);
register(PluginView, PluginViewModel);
register(StoreListView, StoreListViewModel);
register(EditStoreItemView, EditStoreItemViewModel);
register(ModuleListView, ModuleListViewModel);
register(ModuleDetailView, ModuleDetailViewModel);
register(CommandListView, CommandListViewModel);
register(CommandDetailView, CommandDetailViewModel);
register(FileUploadView, FileUploadViewModel);
register(ServerConfigView, ServerConfigViewModel);

/**
 * @param {Function} View
 * @param {Function} ViewModel
 */
function register(View, ViewModel) {
    panels[View.prototype.constructor.name] = {
        View: View,
        ViewModel: ViewModel
    };
}

module.exports = panels;
