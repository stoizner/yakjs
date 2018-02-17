const ShowViewCommand = require('./showViewCommand');
const InstanceListView = require('../instance/list/instanceListView');
const serverStatusProvider = require('../core/serverStatusProvider');

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
     * @type {!Subject<boolean>}
     */
    this.isServerOnline = serverStatusProvider.isServerOnline;

    function constructor() {
        context.eventBus.on(ShowViewCommand).register(handleShowViewCommand);

        if (location.hash) {
            self.activeView = location.hash.replace('#', '');
        } else {
            self.activeView = InstanceListView.prototype.constructor.name;
        }

        self.onActiveViewChanged();
    }

    /**
     * @param {!ShowViewCommand} command
     */
    function handleShowViewCommand(command) {
        self.showView(command.ViewConstructor.prototype.constructor.name, command.data);
    }

    /**
     * @param {string} name The name of the panel.
     * @param {*} [data]
     */
    this.showView = function showView(name, data) {
        console.log('Show view', {name: name, data:data});

        self.activeView = name;
        self.activeViewData = data || null;
        self.onActiveViewChanged();

        if (!data) {
            history.pushState(null, '', '#' + name);
        }
    };

    constructor();
}

module.exports = WorkspaceViewModel;
