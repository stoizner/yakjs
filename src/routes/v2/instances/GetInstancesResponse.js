'use strict';

/**
 * @constructor
 * @struct
 */
class GetInstancesResponse {
    /**
     *
     * @param {Partial<GetInstancesResponse>} getInstancesResponseInit
     */
    constructor(getInstancesResponseInit) {
        this.instances = getInstancesResponseInit.instances || [];
    }
}

module.exports = {GetInstancesResponse};
