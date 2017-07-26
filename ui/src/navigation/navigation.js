/**
 * Tab Panel behaviour
 * @param {jQuery} parent
 * @constructor
 * @struct
 */
function Navigation(parent) {
    'use strict';

    /**
     * @type {Navigation}
     */
    var self = this;

    /**
     * @type {jQuery}
     */
    var activeItemIndicator = null;

    /**
     * @type {function(string)}
     */
    this.onNavigationChanged = _.noop;

    /**
     * Setup tab widget. {HTMLElement}
     */
    function constructor() {
        parent.find('[data-ref]').click(handleNavigationItemClick);

        activeItemIndicator = parent.find('.navigation-indicator');
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleNavigationItemClick(event) {
        var clickedItem = $(event.target).closest('li[data-ref]');
        var target = clickedItem.attr('data-ref');

        self.moveIndicatorTo(target);
        self.onNavigationChanged(target);
    }

    /**
     * @param {string} itemReference
     */
    this.moveIndicatorTo = function switchTo(itemReference) {
        if (itemReference) {
            var navigationItem = parent.find('[data-ref=' + itemReference + ']');

            if (navigationItem.length > 0) {
                parent.find('[data-ref]').removeClass('state-active');
                navigationItem.addClass('state-active');

                updateIndicatorPositionTo(navigationItem);
            }
        }
    };

    /**
     * @param {jQuery} navigationItem
     */
    function updateIndicatorPositionTo(navigationItem) {
        var left = parent.position().left + navigationItem.position().left;

        activeItemIndicator.css('left', left);
        activeItemIndicator.css('width', navigationItem.outerWidth());
    }

    constructor();
}

module.exports = Navigation;
