/* global cobu:false */

$(document).ready(function() {

    'use strict';

    console.log('ready');

    var eventBus = new cobu.EventBus();

    var webSocketAdapter = new yak.ui.WebSocketAdapter(eventBus);

    var viewContext = new yak.ui.ViewContext();
    viewContext.webSocket = webSocketAdapter;
    viewContext.eventBus = eventBus;

    var workspaceView = new yak.ui.WorkspaceView($(document), viewContext);

});

