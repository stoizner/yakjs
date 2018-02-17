const Subject = require('./subject');
const httpAdapter = require('./httpAdapter/httpAdapter');

/**
 * @const
 * @type {number}
 */
const ONLINE_POLLING_TIMESPAN = 10000;

/**
 * @const
 * @type {number}
 */
const OFFLINE_POLLING_TIMESPAN = 2000;

/**
 * @constructor
 * @struct
 */
function ServerStatusProvider() {
    /**
     * @type {ServerStatusProvider}
     */
    var self = this;

    /**
     * @type {!Subject<string>}
     */
    this.version = new Subject('0.0.0');

    /**
     * @type {!Subject<boolean>}
     */
    this.isServerOnline = new Subject(true);

    /**
     * @type {!Subject<Object>}
     */
    this.versionInfo = new Subject(null);

    function constructor() {
        httpAdapter.get('/version').then(function(info) {
            console.log('INFO INFO', info);
            self.versionInfo.change(info);
            self.version.change(info.version);
        });

        checkOnlineStatus();
    }

    function checkOnlineStatus() {
        httpAdapter
            .get('/version')
            .then(function() {
                self.isServerOnline.change(true);
                setTimeout(checkOnlineStatus, ONLINE_POLLING_TIMESPAN);
            })
            .catch(function() {
                self.isServerOnline.change(false);
                setTimeout(checkOnlineStatus, OFFLINE_POLLING_TIMESPAN);
            });
    }

    constructor();
}

module.exports = new ServerStatusProvider();
