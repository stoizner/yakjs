(function() {
    'use strict';

    /**
     * ContextMenu
     * @constructor
     * @param {$|jQuery} element
     * @param {Function} itemClickCallback
     */
    function ContextMenu(element, itemClickCallback) {
        var isRightButtonDown = false;

        var parent = element.parent();
        var isMenuOpen = false;
        var currentContext = null;

        /**
         * Constructor
         */
        function constructor() {
            element.off('click');
            element.off('mouseout');

            element.mouseout(handleMenuMouseOut);
            element.click(handleMenuClick);
        }

        /**
         * Handle click on context-icon.
         * @param context
         * @param event
         */
        this.handleClick = function handleClick(context, event) {
            currentContext = context;

            if (isMenuOpen) {
                closeContextMenu();
            } else {
                var target = $(event.currentTarget);
                var parentOffset = parent.offset();
                var offset = target.offset();

                var relX = offset.left - parentOffset.left;
                var relY = offset.top - parentOffset.top + target.height();

                var maxHeight = element.parent().height();
                var contextHeight = element.height();

                console.log({ relY: relY, contexHeight: contextHeight, maxHeight:maxHeight});

                if (relY + contextHeight > maxHeight) {
                    // move context menu into visible area
                    relY = maxHeight - contextHeight;
                }

                element.css('left', relX);
                element.css('top', relY);
                element.addClass('state-context-open');
                isMenuOpen = true;
            }
        };

        /**
         *
         * @param event
         */
        function handleMenuClick(event) {
            if (itemClickCallback) {
                itemClickCallback(currentContext, event);
            }
            closeContextMenu();
        }

        /**
         * @param event
         */
        function handleMenuMouseOut(event) {
            var e = event.toElement || event.relatedTarget;
            if (element.has(e).length > 0) {
                return;
            }
            closeContextMenu();
        }

        /**
         * Close context menu
         */
        function closeContextMenu() {
            if (isMenuOpen) {
                element.removeClass('state-context-open');
                isMenuOpen = false;
            }
        }

        constructor();
    }

    /**
    * @param {$|jQuery} element
    * @param {Function} itemClickCallback
    */
    $.fn.contextMenu = function contextMenu(element, itemClickCallback) {

        var menu = new ContextMenu(element, itemClickCallback);

        this.each(function() {
            var context = $(this);
            context.click(function(event) { menu.handleClick(context, event); });
        });
    };
}());
