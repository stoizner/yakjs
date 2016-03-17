/**
 * @name DollarBreakPlugin
 * @description Fixing issue #47.
 * @version 0.1.0
 * @type WebSocketPlugin
 * @constructor
 */
function DollarBreakPlugin(require) {
    'use strict';

    var $foo = '$bar';

    this.onInitialize = function onInitialize() {
        var $x = $('issue-#47-dollar-var-breaks-plugin');
    };
}
