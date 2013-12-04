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
            // Prevent default context menu.
            parent.bind('contextmenu', function(){
                return false;
            });

            element.off('click');
            element.off('mouseout');

            element.mouseout(handleMenuMouseOut);
            element.click(handleMenuClick);
        }

        /**
         * @param event
         */
        this.mousedown = function mousedown(event) {
            console.log('mousedown');
            if (event.which === 3) {
                isRightButtonDown = true;
            }
        };

        /**
         *
         * @param event
         * @param context
         */
        this.mouseup = function mouseup(context, event) {
            console.log('mouseup');
            if (isRightButtonDown) {
                console.log('handleMouseUp');
                currentContext = context;
                isRightButtonDown = false;


                var parentOffset = parent.offset();

                var relX = event.pageX - parentOffset.left;
                var relY = event.pageY - parentOffset.top;

                element.css('left', relX - 10);
                element.css('top', relY - 10);
                element.show();

                isMenuOpen = true;
                currentContext.addClass('state-context-open');
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
                console.log('handleMenuMouseOut');
                element.hide();
                currentContext.removeClass('state-context-open');
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
            context.mousedown(function(event) { menu.mousedown(event); });
            context.mouseup(function(event) { menu.mouseup(context, event); });
        });
    };
}());
