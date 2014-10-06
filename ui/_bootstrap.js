/*global ko:false, cobu:false, Mustache:false */

$(document).ready(function bootstrap() {
    'use strict';

    var eventBus = new cobu.EventBus();
    eventBus.diagnostics().onError(handleEventBusError);

    var webSocketAdapter = new yak.ui.WebSocketAdapter(eventBus);

    var viewModelContext = new yak.ui.ViewModelContext();
    viewModelContext.webSocket = webSocketAdapter;
    viewModelContext.eventBus = eventBus;

    var viewContext = new yak.ui.ViewContext();
    viewContext.template = new yak.ui.TemplateLoader(Mustache);
    viewContext.ko = ko;

    var viewFactory = new yak.ui.ViewFactory(viewContext, viewModelContext);
    viewContext.viewFactory = viewFactory;

    viewFactory.create($('.workspace'), yak.ui.WorkspaceView, yak.ui.WorkspaceViewModel);

    connectToYakJsServer(eventBus);

    //var workspaceView = new yak.ui.WorkspaceView($(document), viewContext);
});

/**
 * Connect to the YakJs server
 * @param {cobu.EventBus} eventBus
 */
function connectToYakJsServer(eventBus) {
    'use strict';

    eventBus.post(new yak.ui.WebSocketConnectCommand(yak.config.webSocketUri));

    eventBus.on(yak.ui.WebSocketOpenEvent).register(function handleOpenEvent() {
        console.log('on yak.ui.WebSocketOpenEvent');
        eventBus.post(new yak.ui.UpdateNotificationCommand(null));
    });

    eventBus.on(yak.ui.WebSocketCloseEvent).register(function handleCloseEvent() {
        console.log('on yak.ui.WebSocketCloseEvent');
        self.isWebSocketConnected = false;
        eventBus.post(new yak.ui.UpdateNotificationCommand('Can not connect to yakjs-server or connection closed. Is YakJs running?'));
    });
}

//noinspection JSHint
/**
 * EventBus error handler
 * @param {cobu.EventBusError} eventBusError
 */
function handleEventBusError(eventBusError) {
    'use strict';
    console.error('Unexpected error', { eventBusError: eventBusError });

    if (eventBusError.originalError && eventBusError.originalError.stack) {
        console.error(eventBusError.originalError.stack);
    }
}
