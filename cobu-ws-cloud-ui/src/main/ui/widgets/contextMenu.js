(function() {


   /**
    * ContextMenu
    * @constructor
    * @param {$|jQuery} menu
    * @param {Function} itemClickCallback
    */
   function ContextMenu(menu, itemClickCallback) {

      var isRightButtonDown = false;

      var parent = menu.parent();
      var isMenuOpen = false;
      var currentContext = null;
      /**
       * Constructor
       */
      function constructor() {
         // Prevent default context menu.
         parent.bind("contextmenu",function(){
            return false;
         });

         menu.off('click');
         menu.off('mouseout');

         menu.mouseout(handleMenuMouseOut);
         menu.click(handleMenuClick);
      }

      /**
       *
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

            menu.css('left', relX - 10);
            menu.css('top', relY - 10);
            menu.show();

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
       *
       * @param event
       */
      function handleMenuMouseOut(event) {
         var e = event.toElement || event.relatedTarget;
         if (menu.has(e).length > 0) {
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
            menu.hide();
            currentContext.removeClass('state-context-open');
            isMenuOpen = false;
         }
      }

      constructor();
   }

   /**
    * @param {$|jQuery} menu
    * @param {$|jQuery} menuContainer
    * @param {Function} itemClickCallback
    */
   $.fn.contextMenu = function contextMenu(menu, itemClickCallback) {

      var contextMenu = new ContextMenu(menu, itemClickCallback);

      this.each(function() {
         var context = $(this);
         context.mousedown(function(event) { contextMenu.mousedown(event); });
         context.mouseup(function(event) { contextMenu.mouseup(context, event); });
      });
   }

}());
