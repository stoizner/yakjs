'use strict';

/**
 * @type {!Array<!{callback:function(Object|string)}>}
 */
var subscriptions = [];

/**
 * @param {!Object|string} message
 */
function post(message) {
    subscriptions.forEach((subscription) => {
        try {
            subscription.callback(message);
        } catch(ex) {
            // Continue...
        }
    });
}

/**
 * Subscribe for event bus messages.
 * @param {function(Object|string)} onMessageCallback
 */
function subscribe(onMessageCallback) {
    var subscription = {
        callback: onMessageCallback
    };
    subscriptions.push(subscription);

    return subscription;
}

/**
 * Unsubscribe for event bus messages.
 * @param {{callback:function(Object|string)}} subscription
 */
function unsubscribe(subscription) {
    subscriptions = subscriptions.filter((subscriptionItem) => subscriptionItem !== subscription);
}

module.exports.post = post;
module.exports.subscribe = subscribe;
module.exports.unsubscribe = unsubscribe;
