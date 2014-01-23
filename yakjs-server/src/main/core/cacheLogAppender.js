/**
 * @const
 * @type {number}
 */
yak.MAX_ITEMS_LOG_CACHE = 1000;

/**
 * @type {Array.<yak.api.LogInfo>}
 */
yak.logCache = [];

/**
 * Cache Log Appender
 * @param level
 * @param category
 * @param message
 * @param data
 */
yak.cacheLogAppender = function cacheLogAppender(level, category, message, data) {
    'use strict';

    var logInfo = new yak.api.LogInfo();
    var info = message;

    if (data) {
        var dataText = JSON.stringify(data);
        if (dataText.length > 500) {
            dataText = dataText.substr(0, 500) + '...';
        }
        info += ' | ' + dataText;
    }

    logInfo.info = info;
    logInfo.level = level;
    logInfo.time = (new Date()).toISOString();
    logInfo.category = category;

    yak.logCache.push(logInfo);

    if (yak.logCache.length > yak.MAX_ITEMS_LOG_CACHE) {
        yak.logCache = yak.logCache.slice(yak.logCache.length - yak.MAX_ITEMS_LOG_CACHE);
    }
};