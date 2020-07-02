'use strict';

/**
 * @constructor
 * @struct
 */
export class GetInstancesResponse {
    /**
     *
     * @param {Partial<GetInstancesResponse>} getInstancesResponseInit
     */
    constructor(getInstancesResponseInit) {
        this.instances = getInstancesResponseInit.instances || [];
    }
}
