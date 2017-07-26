'use strict';

/**
 * @constructor
 * @struct
 * @param {jQuery} parent
 */
function MessageBox(parent) {
    parent.hide();

    /**
     * @param {string} messageText
     */
    this.showWarning = function showWarning(messageText) {
        parent.show();
        parent.html('<div class="warning-text">' + messageText + '</div>');
    };

    this.hide = function hide() {
        parent.hide();
    };
}

module.exports = MessageBox;
