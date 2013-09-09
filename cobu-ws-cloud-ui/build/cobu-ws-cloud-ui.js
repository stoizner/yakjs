/**
 * Codebullets
 * @namespace cobu
 */
var cobu = cobu || {};

/**
 * Web Socket Cloud
 * @namespace cobu
 */
cobu.wsc = cobu.wsc || {};

/**
 * Web Socket Cloud - Service API
 * @namespace cobu
 */
cobu.wsc.service = cobu.wsc.service || {};

/**
 * Web Socket Cloud UI
 * @namespace cobu
 */
cobu.wsc.ui = cobu.wsc.ui || {};


/**
 * Name compare
 * @param {{name:string}} a The first object
 * @param{{name:string}} b The second object
 */
cobu.wsc.ui.nameCompare = function nameCompare(a, b) {

   /**
    * @type {number}
    */
   var result = 0;


   if (a.name < b.name) {
      result = -1;
   } else if (a.name > b.name) {
      result = 1;
   }

   return result;
};/**
 * ViewContext
 * @class
 * @constructor
 */
cobu.wsc.ui.ViewContext = function ViewContext()
{
   'use strict';

   /** @type {cobu.wsc.ui.ViewContext} */
   var self = this;

   /**
    * @type {cobu.wsc.ui.WebSocketAdapter}
    */
   this.webSocket = null;

   /**
    * @type {cobu.EventBus}
    */
   this.eventBus = null;

   /** Constructor */
   function constructor() {
   }

   constructor();
};/**
 * WebSocketAdapter
 * @class
 * @constructor
 * @param {cobu.EventBus} eventBus
 */
cobu.wsc.ui.WebSocketAdapter = function WebSocketAdapter(eventBus)
{
   'use strict';

   /** @type {cobu.wsc.ui.WebSocketAdapter} */
   var self = this;

   var websocket = null;

   this.onopen = null;
   this.onclose = null;
   this.onerror = null;

   /** Constructor */
   function constructor() {
   }

   /**
    * Connect to web socket server.
    * @param wsUri
    */
   this.connect = function connect(wsUri) {

      try {
         websocket = new WebSocket(wsUri);
         websocket.onopen = handleOpen;
         websocket.onclose = handleClose;
         websocket.onmessage = handleMessage;
         websocket.onerror = handleError;
      } catch(ex) {
         console.log(ex);
         websocket = null;

         if (self.onerror) {
            self.onerror();
         }
      }
   };

   /**
    *
    * @param {string|object} message
    */
   this.send = function send(message) {
      if (typeof message === 'object') {
         websocket.send(JSON.stringify(message));
      } else {
         websocket.send(message);
      }
   };

    /**
     *
     * @param event
     */
    function handleOpen(event) {
        console.log("CONNECTED");

        if (self.onopen) {
            self.onopen();
        }

        eventBus.post(new cobu.wsc.ui.WebSocketOpenEvent());
    }

   /**
    *
    * @param event
    */
   function handleClose(event) {
      console.log("DISCONNECTED");

      if (self.onclose) {
         self.onclose();
      }

       eventBus.post(new cobu.wsc.ui.WebSocketCloseEvent());
   }

   /**
    *
    * @param event
    */
   function handleMessage(event) {

      var msg = null;

      try {
         msg = JSON.parse(event.data);
      } catch(ex) {
         console.log(ex);
      }

      if (msg) {
         eventBus.post(msg);
      }
   }

    /**
     *
     * @param event
     */
    function handleError(event) {

        console.log(event);

        if (self.onerror) {
            self.onerror();
        }

        eventBus.post(new cobu.wsc.ui.WebSocketCloseEvent());
    }

    constructor();
};/**
 * WebSocketClosedEvent
 * @constructor
 */
cobu.wsc.ui.WebSocketCloseEvent = function WebSocketCloseEvent() {
    'use strict';
    this.type = 'cobu.wsc.ui.WebSocketCloseEvent';
};/**
 * WebSocketOpenEvent
 * @constructor
 */
cobu.wsc.ui.WebSocketOpenEvent = function WebSocketOpenEvent() {
    'use strict';
    this.type = 'cobu.wsc.ui.WebSocketOpenEvent';
};/**
 * HeaderView
 * @class
 * @constructor
 * @param {$} parent
 * @param {cobu.wsc.ui.ViewContext} context
 */
cobu.wsc.ui.HeaderView = function HeaderView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.HeaderView} */
   var self = this;

   var WEB_SOCKET_URI_STORAGE_KEY = 'cobu-wsc-ui-user-data-web-socket-uri';

   var uriInput = null;

   /** Constructor */
   function constructor() {

      uriInput = $('#webSocketUri', parent);
      uriInput.val(getLastUsedWebSocketUri());
      uriInput.focusout(handleUriFocusOut);

      $('#webSocketConnect').click(handleConnectClick);

      context.webSocket.onclose = handleSocketClose;
      context.webSocket.onopen = handleSocketOpen;
      context.webSocket.onerror = handleSocketError;
      context.webSocket.connect(uriInput.val());
   }

   /**
    *
    */
   function handleSocketOpen() {
      uriInput.removeClass('state-error');
      uriInput.addClass('state-connected');
   }

   /**
    *
    */
   function handleSocketClose() {
      uriInput.removeClass('state-connected');
      uriInput.removeClass('state-error');
   }

   /**
    *
    */
   function handleSocketError() {
      uriInput.removeClass('state-connected');
      uriInput.addClass('state-error');
   }

   /**
    * Handle connect button click.
    */
   function handleConnectClick() {
      saveWebSocketUri();
      context.webSocket.connect($('#webSocketUri').val());
   }

   /**
    * handleUriFocusOut
    */
   function handleUriFocusOut() {
      saveWebSocketUri();
   }

   /**
    * Save websocket uri.
    */
   function saveWebSocketUri() {
      localStorage.setItem(WEB_SOCKET_URI_STORAGE_KEY, $('#webSocketUri').val());
   }

   /**
    * @returns {string}
    */
   function getLastUsedWebSocketUri() {

      var webSocketUri = localStorage.getItem(WEB_SOCKET_URI_STORAGE_KEY);
      webSocketUri = webSocketUri || 'ws://localhost:8080';

      return webSocketUri;
   }

   constructor();
};/**
 * InstanceListView
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.InstanceListView = function InstanceListView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.InstanceListView} */
   var self = this;

   var itemTemplate = Mustache.compile($('#instance-item-tpl').html());

   var itemContainer = $('.instance-items', parent);

   /**
    *
    * @type {Array.<cobu.wsc.service.InstanceInfo>}
    */
   var listItems = [];

   var contextMenuActions = {};

   /** Constructor */
   function constructor() {
      context.eventBus.on(cobu.wsc.service.GetInstancesResponse).register(handleGetInstancesResponse);
      context.eventBus.on(cobu.wsc.service.StartInstanceResponse).register(handleResponseAndRefreshList);
      context.eventBus.on(cobu.wsc.service.StopInstanceResponse).register(handleResponseAndRefreshList);
      context.eventBus.on(cobu.wsc.service.RemoveInstanceResponse).register(handleResponseAndRefreshList);

      contextMenuActions['edit'] = handleContextMenuEdit;
      contextMenuActions['start'] = handleContextMenuStart;
      contextMenuActions['stop'] = handleContextMenuStop;
      contextMenuActions['delete'] = handleContextMenuDelete;

      $('#instance-refresh').click(handleResponseAndRefreshList);
      $('#instance-new').click(function() { context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-instance-edit')); });
   }

   /**
    *
    */
   function handleResponseAndRefreshList() {
      context.webSocket.send(new cobu.wsc.service.GetInstancesRequest());
   }

   /**
    * Activate View
    */
   this.active = function active() {
      context.webSocket.send(new cobu.wsc.service.GetInstancesRequest());
   };

   /**
    * @param {cobu.wsc.service.GetInstancesResponse} event
    */
   function handleGetInstancesResponse(response) {
      console.log('handleGetInstancesResponse');

      listItems = response.instances;
      self.update();
   }

   /**
    * Update panel list
    */
   this.update = function update() {

      var html = '';

      listItems.sort(cobu.wsc.ui.nameCompare);

      for(var i=0; i<listItems.length; i++) {
         html += itemTemplate(listItems[i]);
      }

      itemContainer.html(html);

      $('.instance-item', itemContainer).contextMenu($('#instance-item-context'), handleMenuClicked);
   };

   /**
    * @param event
    * @param context
    */
   function handleMenuClicked(context, event) {

      var instanceName = context.attr('data-instance');
      var menuAction = $(event.target).attr('data-menu');

      if (contextMenuActions.hasOwnProperty(menuAction)) {
         contextMenuActions[menuAction](instanceName)
      } else {
         console.warn("No context menu handler found for " + menuAction);
      }
   }

   /**
    *
    * @param instanceName
    */
   function handleContextMenuEdit(instanceName) {

      var instanceInfo = null;

      for(var i=0; i<listItems.length; i++) {
         if (listItems[i].name === instanceName) {
            instanceInfo = listItems[i];
            break;
         }
      }

      context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-instance-edit', instanceInfo));
   }

   /**
    *
    * @param instanceName
    */
   function handleContextMenuStart(instanceName) {
      var request = new cobu.wsc.service.StartInstanceRequest();
      request.instanceName = instanceName;
      context.webSocket.send(request);
   }

   /**
    *
    * @param instanceName
    */
   function handleContextMenuStop(instanceName) {
      var request = new cobu.wsc.service.StopInstanceRequest();
      request.instanceName = instanceName;
      context.webSocket.send(request);
   }

   /**
    *
    * @param instanceName
    */
   function handleContextMenuDelete(instanceName) {
      var request = new cobu.wsc.service.RemoveInstanceRequest();
      request.instanceName = instanceName;
      context.webSocket.send(request);
   }

   constructor();
};/**
 * InstanceView
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.InstanceView = function InstanceView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.InstanceView} */
   var self = this;

   /**
    * @type {null|cobu.wsc.service.InstanceInfo}
    */
   var instanceInfo = null;

   /** Constructor */
   function constructor() {

      $('#instance-save', parent).click(handleSaveClick);
      context.eventBus.on(cobu.wsc.service.CreateInstanceResponse).register(handleResponse);
      context.eventBus.on(cobu.wsc.service.UpdateInstanceResponse).register(handleResponse);
   }

   /**
    * Activate view
    * @param {string|object} data
    */
   this.active = function active(data) {
        console.log('InstanceView active', data);

        $('.error-line', parent).hide();

        if (data !== null) {
            instanceInfo = data;
        } else {
            instanceInfo = null;
        }

        self.update();
   };

    /**
    * Update form.
    */
    this.update = function update() {
        if (instanceInfo === null) {
            $('[data-bind]', parent).val('');
        } else {
            $('[data-bind]', parent).each(function() {
                var element = $(this);
                var name = element.attr('data-bind');
                element.val(instanceInfo[name]);
            });

            $('[data-bind="pluginsCsv"]', parent).val(instanceInfo.plugins.join(','));
        }
    };

   /**
    * @param {cobu.wsc.service.CreateInstanceResponse} response
    */
   function handleResponse(response) {
        console.log('handleResponse', response);

        var errorLine = $('.error-line', parent);
        if (response.success) {
            context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-instance'));
            errorLine.hide();
        } else {
            errorLine.show();
            $('.error-line-text', errorLine).html(response.message.replace(/\n/g, '<br />'));
        }
   }

   /**
    * Handle Create Click
    */
   function handleSaveClick() {
      var data = bind();

      console.log(data);

      var request = null;

      if (instanceInfo === null) {
         request = new cobu.wsc.service.CreateInstanceRequest();
         $.extend(request, data);
         request.plugins = data.pluginsCsv.split(',');

      } else {
         request = new cobu.wsc.service.UpdateInstanceRequest();
         $.extend(request, data);
         request.plugins = data.pluginsCsv.split(',');
         request.instanceName = instanceInfo.name;
      }

      $.extend(request, data);
      context.webSocket.send(request);
   }

   /**
    * Bind from form
    * @returns {{}}
    */
   function bind() {

      var data = {};

      $('[data-bind]', parent).each(function() {
         var element = $(this);
         var name = element.attr('data-bind');
         data[name] = element.val();
      });

      return data;
   }

   constructor();
};/**
 * Auto Document
 * @param {CodeMirror} cm
 */
cobu.wsc.ui.codeEditorAutoComplete = function(cm) {
    CodeMirror.showHint(cm, CodeMirror.hint.javascript, { additionalContext: cobu.wsc.ui.codeEditorContext });
};
/**
 * Auto Document
 * @param {CodeMirror} cm
 */
cobu.wsc.ui.codeEditorAutoDocument = function(cm) {
    var cursor = cm.getCursor();
    console.log(cursor);
    cm.setCursor(cursor.line, 0);
    cm.replaceSelection('\n');
    cm.setCursor(cursor.line, 0);
    cm.replaceSelection('/**\n * \n */');
    cm.setCursor(cursor.line+1, cursor.ch);
};
/**
 * Code Editor context for improved code completion.
 */
cobu.wsc.ui.codeEditorContext = {
    connection: {
        id: null,
        send: function(data) {}
    },
    message: {
        data: ''
    },
    instance: {
        name: '',
        description: '',
        port: 0,
        plugins:[],
        log: {
            info:function(){},
            warn:function(){},
            error:function(){}
        },
        state: ''
    }
};
/**
 * EmptyPluginTemplate
 * @constructor
 */
cobu.wsc.ui.EmptyPluginTemplate = function Plugin() {

    'use strict';

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onInitialize = function onInit(instance) {};

    /**
     * @param {cobu.wsc.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {cobu.wsc.WebSocketMessage} message
     * @param {cobu.wsc.WebSocketConnection} connection
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {};

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onTerminate = function onInit(instance) {};
};/**
 * PluginListView
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.PluginListView = function PluginListView(parent, context) {
   'use strict';

   /** @type {cobu.wsc.ui.InstanceListView} */
   var self = this;

   var itemTemplate = Mustache.compile($('#plugin-item-tpl').html());

   var itemContainer = $('.plugin-items', parent);

   var listItems = [];

   var contextMenuActions = {};

   /** Constructor */
   function constructor() {
      context.eventBus.on(cobu.wsc.service.GetPluginsResponse).register(handleGetPluginsResponse);
      context.eventBus.on(cobu.wsc.service.RemovePluginResponse).register(handleRemovePluginResponse);

      contextMenuActions['edit'] = handleContextMenuEdit;
      contextMenuActions['delete'] = handleContextMenuDelete;

      $('#plugin-refresh').click(handleButtonRefreshClick);
      $('#plugin-new').click(function() { context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-plugin-edit')); });
   }

   /**
    * Handle refresh button click
    */
   function handleButtonRefreshClick() {
      context.webSocket.send(new cobu.wsc.service.GetPluginsRequest());
   }

   /**
    * Activate View
    */
   this.active = function active() {
      context.webSocket.send(new cobu.wsc.service.GetPluginsRequest());
   };

   /**
    * @param {cobu.wsc.service.GetPluginsResponse} response
    */
   function handleGetPluginsResponse(response) {
      console.log('handleGetPluginsResponse', response);

      listItems = response.plugins;
      self.update();
   }

   /**
    * @param {cobu.wsc.service.RemovePluginResponse} response
    */
   function handleRemovePluginResponse(response) {
      console.log('handleRemovePluginResponse', response);
      context.webSocket.send(new cobu.wsc.service.GetPluginsRequest());
   }

   /**
    * Update panel list
    */
   this.update = function update() {

      var html = '';

      listItems.sort(cobu.wsc.ui.nameCompare);

      for(var i=0; i<listItems.length; i++) {
         html += itemTemplate(listItems[i]);
      }

      itemContainer.html(html);

      $('.plugin-item', itemContainer).contextMenu($('#plugin-item-context'), handleMenuClicked);
   };

   /**
    * @param event
    * @param context
    */
   function handleMenuClicked(context, event) {

      var pluginName = context.attr('data-plugin');
      var menuAction = $(event.target).attr('data-menu');

      if (contextMenuActions.hasOwnProperty(menuAction)) {
         contextMenuActions[menuAction](pluginName)
      } else {
         console.warn("No context menu handler found for " + menuAction);
      }
   }

   /**
    *
    * @param pluginName
    */
   function handleContextMenuEdit(pluginName) {
      var pluginInfo = null;

      for(var i=0; i<listItems.length; i++) {
         if (listItems[i].name === pluginName) {
            pluginInfo = listItems[i];
            break;
         }
      }

      context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-plugin-edit', pluginInfo));
   }

   /**
    *
    * @param {string} pluginName
    */
   function handleContextMenuDelete(pluginName) {
      var request = new cobu.wsc.service.RemovePluginRequest();
      request.pluginName = pluginName;
      context.webSocket.send(request);
   }

   constructor();
};/**
 * PluginView
 * @class
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$|jQuery} parent
 */
cobu.wsc.ui.PluginView = function PluginView(parent, context) {
    'use strict';

    /** @type {cobu.wsc.ui.PluginView} */
    var self = this;

    /**
    * @type {null||cobu.wsc.service.PluginInfo}
    */
    var pluginInfo = null;

    /**
    * @type {null|CodeMirror}
    */
    var codeEditor = null;

    /**
     * @type {string}
     */
    var pluginCodeTemplate = cobu.wsc.ui.EmptyPluginTemplate.toString();

    /** Constructor */
    function constructor() {
        $('#plugin-save', parent).click(handleSaveClick);

        context.eventBus.on(cobu.wsc.service.CreatePluginResponse).register(handleResponse);
        context.eventBus.on(cobu.wsc.service.UpdatePluginResponse).register(handleResponse);

        CodeMirror.commands.autocomplete = cobu.wsc.ui.codeEditorAutoComplete;
        CodeMirror.commands.autodocument = cobu.wsc.ui.codeEditorAutoDocument;

        codeEditor = CodeMirror($('#codeEditor')[0], {
            value:  '',
            mode:  'javascript',
            lineNumbers: false,
            indentUnit: 4,
            extraKeys: { 'Ctrl-Space': 'autocomplete', 'Ctrl-D': 'autodocument' }
        });
    }

    /**
    * Activate view
    * @param {string|object} data
    */
    this.active = function active(data) {
        console.log('InstanceView active', data);

        $('.error-line', parent).hide();

        if (data !== null) {
            pluginInfo = data;
        } else {
            pluginInfo = null;
        }

        self.update();
    };

    /**
     * Update DOM.
     */
    this.update = function update() {
        if (pluginInfo === null) {
            $('[data-bind]', parent).val('');
            codeEditor.setValue(pluginCodeTemplate);
        } else {
            $('[data-bind]', parent).each(function() {
                var element = $(this);
                var name = element.attr('data-bind');
                element.val(pluginInfo[name]);
            });

            codeEditor.setValue(pluginInfo.code);
        }
    };

    /**
     * @param {cobu.wsc.service.CreateInstanceResponse} response
     */
    function handleResponse(response) {
        console.log('handleResponse', response);

        var errorLine = $('.error-line', parent);

        if (response.success) {
            context.eventBus.post(new cobu.wsc.ui.ActivatePanelCommand('panel-plugin'));
            errorLine.hide();
        } else {
            errorLine.show();
            $('.error-line-text', errorLine).html(response.message.replace(/\n/g, '<br />'));
        }
    }

    /**
     * Handle Create Click
     */
    function handleSaveClick() {
        var data = bind();

        console.log(data);

        var request = null;

        if (pluginInfo === null) {
            request = new cobu.wsc.service.CreatePluginRequest();
            $.extend(request, data);
        } else {
            request = new cobu.wsc.service.UpdatePluginRequest();
            $.extend(request, data);
            request.pluginName = pluginInfo.name;
        }

        $.extend(request, data);
        context.webSocket.send(request);
    }

    /**
    * Bind from form
    * @returns {{}}
    */
    function bind() {

        var data = {};

        $('[data-bind]', parent).each(function() {
            var element = $(this);
            var name = element.attr('data-bind');
            data[name] = element.val();
        });

        data.code = codeEditor.getValue();

        return data;
    }

    constructor();
};(function() {


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
/**
 * ActivatePanelCommand
 * @constructor
 * @param {string} name the panel name.
 * @param {string|object} [data]
 */
cobu.wsc.ui.ActivatePanelCommand = function ActivatePanelCommand(name, data)
{
   'use strict';

   this.type="ui.command.activatePanel";

   /**
    * Name of the panel.
    * @type {string}
    */
   this.panelName = name;

   /**
    *
    * @type {string|string}
    */
   this.data = data || null;
};/**
 * WorkspaceView
 * @class
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.WorkspaceView = function WorkspaceView(parent, context)
{
   'use strict';

    /** @type {cobu.wsc.ui.WorkspaceView} */
    var self = this;

    /**
     * @type {$|jQuery}
     */
    var header = null;

    /**
     * @type {$|jQuery}
     */
    var instanceList = null;

    /**
     * @type {Object.<string, object>}
     */
    var panelViews = {};

    /**
     *  Constructor
     */
    function constructor() {

        header = new cobu.wsc.ui.HeaderView($('.header', parent), context);
        panelViews['panel-instance'] = new cobu.wsc.ui.InstanceListView($('.panel-instance', parent), context);
        panelViews['panel-instance-edit'] = new cobu.wsc.ui.InstanceView($('.panel-instance-edit', parent), context);
        panelViews['panel-plugin'] = new cobu.wsc.ui.PluginListView($('.panel-plugin', parent), context);
        panelViews['panel-plugin-edit'] = new cobu.wsc.ui.PluginView($('.panel-plugin-edit', parent), context);

        context.eventBus.on(cobu.wsc.ui.ActivatePanelCommand).register(handleActivatePanel);
        context.eventBus.on(cobu.wsc.ui.WebSocketOpenEvent).register(handleWebSocketOpen);
        context.eventBus.on(cobu.wsc.ui.WebSocketCloseEvent).register(handleWebSocketClosed);

        $('.menu li', parent).click(handleMenuItemClick);
        hidePanels();
        showPleaseConnectNotification();
    }

    /**
     * Handle event when web socket was opened.
     */
    function handleWebSocketOpen() {
        console.log('handleWebSocketOpen');
        $('.notification', parent).hide();

        $('.menu', parent).show();
        $('.panels', parent).show();

        activatePanel('panel-instance', null);
    }

    /**
     * Handle event when web socket was closed.
     */
    function handleWebSocketClosed() {
        console.log('handleWebSocketClosed');
        showPleaseConnectNotification();
    }

    /**
     * Show 'Please connect to service port' notification
     */
    function showPleaseConnectNotification() {
        var notificationBar = $('.notification', parent);
        notificationBar.html('Please connect to service port (default: 8790) of cobu-ws-cloud.');
        notificationBar.show();
        $('.menu', parent).hide();
        $('.panels', parent).hide();
    }

    /**
     * @param {cobu.wsc.ui.ActivatePanelCommand} command
     */
    function handleActivatePanel(command) {
        console.log('handleActivatePanel', command);
        activatePanel(command.panelName, command.data);
    }

    /**
    *
    * @param event
    */
    function handleMenuItemClick(event) {
        var target = $(event.currentTarget);
        var panelName = target.attr('data-panel');

        $('.menu li', parent).removeClass('state-active');
        target.addClass('state-active');

        activatePanel(panelName);
    }

    /**
     * @param {string} name
     * @param {null|string|object} data
     */
    function activatePanel(name, data) {
        console.log('activatePanel', name, data);
        hidePanels();
        $('.panels .' + name, parent).show();

        if (panelViews.hasOwnProperty(name)) {
            panelViews[name].active(data);
        }
    }

    /**
     * Hide all panels.
     */
    function hidePanels() {
        $('.panels .panel', parent).hide();
    }

    constructor();
};$(document).ready(function() {

   console.log('ready');

   var eventBus = new cobu.EventBus();

   var webSocketAdapter = new cobu.wsc.ui.WebSocketAdapter(eventBus);

   var viewContext = new cobu.wsc.ui.ViewContext();
   viewContext.webSocket = webSocketAdapter;
   viewContext.eventBus = eventBus;

   var workspaceView = new cobu.wsc.ui.WorkspaceView($(document), viewContext);

});

