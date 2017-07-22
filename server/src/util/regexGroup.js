'use strict';

 /**
 * Extract the value of the first matching group from a given regexp string or null.
 * @param {string} text
 * @param {string} regexp
 * @returns {Array<string>} When matches all matching groups or null.
 */
function regexGroup(text, regexp) {
    let matchedGroups = null;
    let regex = new RegExp(regexp);
    let matches = regex.exec(text);

    if (matches) {
        matchedGroups = matches;
    }

    return matchedGroups;
}

module.exports = regexGroup;
