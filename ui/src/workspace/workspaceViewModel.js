var ShowViewCommand = require('./showViewCommand');
var InstanceListView = require('../instance/list/instanceListView');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function WorkspaceViewModel(context) {
    'use strict';

    /**
     * @type {WorkspaceViewModel}
     */
    var self = this;

    /**
     * The current active panel.
     * @type {?string}
     */
    this.activeView = null;

    /**
     * @type {?}
     */
    this.activeViewData = null;

    /**
     * Callback function for active panel changed event.
     * @type {Function}
     */
    this.onActiveViewChanged = _.noop;

    /**
     * @type {string}
     */
    this.version = '';

    /**
     * @type {Function}
     */
    this.onVersionChanged = _.noop;

    /**
     *  Constructor
     */
    function constructor() {
        context.eventBus.on(ShowViewCommand).register(handleShowViewCommand);

        self.activeView = InstanceListView.prototype.constructor.name;
        self.onActiveViewChanged();

        context.adapter.get('/version').then(function(info) {
            self.version = info.version;
            self.onVersionChanged(info.version);
        });
    }

    /**
     * @param {!ShowViewCommand} command
     */
    function handleShowViewCommand(command) {
        console.log('Change active view', {command: command});
        self.activeView = command.ViewConstructor.prototype.constructor.name;
        self.activeViewData = command.data;
        self.onActiveViewChanged();
    }

    /**
     * @param {string} name The name of the panel.
     * @param {*} [data]
     */
    this.showView = function showView(name, data) {
        self.activeView = name;
        self.activeViewData = data || null;
        self.onActiveViewChanged();
    };

    constructor();
}

module.exports = WorkspaceViewModel;
