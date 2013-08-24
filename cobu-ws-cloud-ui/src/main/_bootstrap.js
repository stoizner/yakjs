$(document).ready(function() {

   var wsUri = "ws://localhost:8080";

   var webSocketAdapter = new cobu.wsc.ui.WebSocketAdapter();
   webSocketAdapter.connect(wsUri);

   var workspaceView = new cobu.wsc.ui.WorkspaceView($("#main"));

});

