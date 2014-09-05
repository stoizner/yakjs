(function createGuidModule() {
    /**
     * S4
     * @returns {string} An 4 alpha-numeric character string block.
     */
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
     * @returns {string} A GUID.
     */
    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    yak.exports.guid = guid;
    yak.api.guid = guid;
}());
