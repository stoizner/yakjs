/**
 * InstanceInfo
 * @constructor
 */
yak.api.InstanceInfo = function InstanceInfo() {

    'use strict';

    /**
    *
    * @type {string}
    */
    this.name = null;

    /**
    *
    * @type {string}
    */
    this.state = null;

    /**
    * Description
    * @type {null|string}
    */
    this.description = null;

    /**
    *
    * @type {number}
    */
    this.connectionCount = 0;

    /**
    *
    * @type {number}
    */
    this.port = null;

    /**
    *
    * @type {Array.<string>}
    */
    this.plugins = [];
};