$(document).ready(function() {

   console.log('ready');

   var eventBus = new cobu.EventBus();

   var webSocketAdapter = new cobu.wsc.ui.WebSocketAdapter(eventBus);

   var viewContext = new cobu.wsc.ui.ViewContext();
   viewContext.webSocket = webSocketAdapter;
   viewContext.eventBus = eventBus;

   var workspaceView = new cobu.wsc.ui.WorkspaceView($(document), viewContext);

});

