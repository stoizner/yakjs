/**
 * ViewModelContext
 * @constructor
 */
yak.ui.ViewModelContext = function ViewModelContext(eventBus) {
    'use strict';

    /**
     * @type {yak.ui.HttpAdapter}
     */
    this.adapter = new yak.ui.HttpAdapter(eventBus);

    /**
     * @type {!cobu.EventBus}
     */
    this.eventBus = eventBus;

    /**
     * @type {!yak.ui.VersionChecker}
     */
    this.versionChecker = new yak.ui.VersionChecker();
};
