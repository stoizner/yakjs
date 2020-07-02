'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @type {!JsonStore}
 */
import jsonStore from '../common/jsonStore.js';

/**
 * @constructor
 * @struct
 */
function AnalyticsPlugin(context) {
    /**
     * @type {string}
     */
    const DATA_KEY = 'plugin.analytics.data';

    this.onMessage = () => {
        let analyticsData = jsonStore.getValue(DATA_KEY);
        let instanceName = context.instance.name;

        if (!analyticsData[instanceName]) {
            analyticsData[instanceName] = {
                messageCount: 0
            };
        }

        analyticsData[instanceName].messageCount += 1;

        jsonStore.setValue(DATA_KEY, analyticsData);
    };
}

export default {
    name: 'analytics',
    description: 'Counts received messages per instance and updates the "plugin.analytics.data" store item.',
    createWorker: context => new AnalyticsPlugin(context)
};

