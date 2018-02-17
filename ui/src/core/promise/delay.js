/**
 * @type {number}
 */
const DEFAULT_DELAY = 200;

/**
 * @param {number} [timeInMilliseconds]
 * @returns {function():!Promise}
 */
function delay(timeInMilliseconds) {
    return function delayPromise() {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, timeInMilliseconds || DEFAULT_DELAY);
        });
    }
}

module.exports = delay;
