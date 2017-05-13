/*global cobu:false, Mustache:false */

var TemplateLoader = require('./core/template/templateLoader');
var ViewContext = require('./core/viewContext');
var ViewFactory = require('./core/viewFactory');
var ViewModelContext = require('./core/viewModelContext');
var WorkspaceView = require('./workspace/workspaceView');
var WorkspaceViewModel = require('./workspace/workspaceViewModel');

$(document).ready(function bootstrap() {
    'use strict';

    var eventBus = new cobu.EventBus();
    eventBus.diagnostics().onError(handleEventBusError);

    var viewModelContext = new ViewModelContext(eventBus);

    var viewContext = new ViewContext();
    viewContext.template = new TemplateLoader(Mustache);

    var viewFactory = new ViewFactory(viewContext, viewModelContext);
    viewContext.viewFactory = viewFactory;

    viewFactory.create($('.workspace'), WorkspaceView, WorkspaceViewModel);
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
