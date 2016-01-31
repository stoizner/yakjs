/*global cobu:false, Mustache:false */

$(document).ready(function bootstrap() {
    'use strict';

    var eventBus = new cobu.EventBus();
    eventBus.diagnostics().onError(handleEventBusError);

    //var webSocketAdapter = new yak.ui.WebSocketAdapter(eventBus);
    var httpAdapter = new yak.ui.HttpAdapter(eventBus);

    var viewModelContext = new yak.ui.ViewModelContext();
    viewModelContext.adapter = httpAdapter;
    viewModelContext.eventBus = eventBus;

    var viewContext = new yak.ui.ViewContext();
    viewContext.template = new yak.ui.TemplateLoader(Mustache);

    var viewFactory = new yak.ui.ViewFactory(viewContext, viewModelContext);
    viewContext.viewFactory = viewFactory;

    viewFactory.create($('.workspace'), yak.ui.WorkspaceView, yak.ui.WorkspaceViewModel);
    viewFactory.create($('[data-view=fileUploadReportView]'), yak.ui.FileUploadReportView, yak.ui.FileUploadReportViewModel);
});

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
