import {SilentLogger} from './SilentLogger.js';

class LoggerService {
    constructor() {
        /**
         * @type {YakLogger}
         */
        this.log = new SilentLogger();
    }
}

export const service = new LoggerService();
export const log = service.log;
export default log;
