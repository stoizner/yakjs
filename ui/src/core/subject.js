/**
 * @constructor
 * @template T
 * @param {function(T)} callback
 */
function Subscription(callback) {
    /**
     * @type {function(T)}
     */
    this.callback = callback
}

/**
 * @constructor
 * @param {T} [value]
 * @template T
 */
function Subject(value) {
    /**
     * @type {Subject}
     */
    var self = this;

    /**
     * @type {!Array<Subscription>}
     */
    var subscriptions = [];

    /**
     * @type {T}
     */
    this.value = value || null;

    /**
     * @param {function(T)} callback
     * @returns {!Subscription}
     */
    this.subscribe = function subscribe(callback) {
        var subscription = new Subscription(callback);
        subscriptions.push(subscription);

        return subscription;
    };

    /**
     * @param {function(T)} callback
     * @returns {!Subscription}
     */
    this.subscribeAndInvoke = function subscribeAndInvoke(callback) {
        callback(self.value);
        return self.subscribe(callback);
    };

    /**
     * @param {function(T)|!Subscription} callbackOrSubscription
     */
    this.unsubscribe = function unsubscribe(callbackOrSubscription) {
        subscriptions = subscriptions.filter(subscription => subscription !== callbackOrSubscription && subscription.callback !== callbackOrSubscription);
    };

    /**
     * @param {T} value
     */
    this.set = function set(value) {
        self.value = Object.freeze(value);
        subscriptions.forEach(subscription => {
            subscription.callback(self.value);
        });
    };

    /**
     * @param {T} value
     */
    this.change = function change(value) {
        if (self.value !== value) {
            self.value = Object.freeze(value);
            subscriptions.forEach(subscription => {
                subscription.callback(self.value);
            });
        }
    };
}

module.exports = Subject;
