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
     * @const
     * @type {number}
     */
    var ONLINE_POLLING_TIMESPAN = 10000;

    /**
     * @const
     * @type {number}
     */
    var OFFLINE_POLLING_TIMESPAN = 2000;

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
     * Callback function when yakjs is online or not.
     * @type {function(boolean)}
     */
    this.onIsOnlineChanged = _.noop;

    var isYakjsOnline = false;

    function constructor() {
        context.eventBus.on(ShowViewCommand).register(handleShowViewCommand);

        if (location.hash) {
            self.activeView = location.hash.replace('#', '');
        } else {
            self.activeView = InstanceListView.prototype.constructor.name;
        }

        self.onActiveViewChanged();

        context.adapter.get('/version').then(function(info) {
            self.version = info.version;
            self.onVersionChanged(info.version);
        });

        checkOnlineStatus();
    }

    function checkOnlineStatus() {
        context.adapter
            .get('/version')
            .then(function() {
                if (!isYakjsOnline) {
                    isYakjsOnline = true;
                    self.onIsOnlineChanged(isYakjsOnline);
                    self.onActiveViewChanged();
                }

                setTimeout(checkOnlineStatus, ONLINE_POLLING_TIMESPAN);
            })
            .catch(function() {
                if (isYakjsOnline) {
                    isYakjsOnline = false;
                    self.onIsOnlineChanged(isYakjsOnline);
                }

                setTimeout(checkOnlineStatus, OFFLINE_POLLING_TIMESPAN);
            });
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
