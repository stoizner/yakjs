 /**
 * Extract the value of the first matching group from a given regexp string or null.
 * @param {string} text
 * @param {string} regexp
 * @returns {Array.<string>} When matches all matching groups or null.
 */
yak.regexGroup = function regexGroup(text, regexp) {
    var matchedGroups = null;
    var regex = new RegExp(regexp);
    var matches = regex.exec(text);

    if (matches) {
        matchedGroups = matches;
    }

    return matchedGroups;
};
