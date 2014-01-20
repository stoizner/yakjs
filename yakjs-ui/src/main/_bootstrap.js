/*global ko:false, cobu:false, Mustache:false */

$(document).ready(function() {
    'use strict';

    console.log('ready');

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

    //var workspaceView = new yak.ui.WorkspaceView($(document), viewContext);
});


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