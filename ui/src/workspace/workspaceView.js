var AppBarView = require('../appBar/appBarView');
var AppBarViewModel = require('../appBar/appBarViewModel');
var Navigation = require('../navigation/navigation');

var panels = require('./workspacePanels');

/**
 * @constructor
 * @struct
 * @param {jQuery} parent
 * @param {!ViewContext} context
 * @param {!WorkspaceViewModel} viewModel
 */
function WorkspaceView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {!Template}
     */
    var template = context.template.load('workspace');

    /**
     * @type {!Navigation}
     */
    var navigation = null;

    /**
     * The current active view.
     * @type {{activate: function(), dispose: function()}}
     */
    var activeView = null;

    function constructor() {
        initializeView();

        viewModel.onActiveViewChanged = createAndShowView;
        viewModel.onVersionChanged = initializeView;
        viewModel.onIsOnlineChanged = updateOfflineWarning;

        parent.bind('dragover', handleFileDragOver);
    }

    function initializeView() {
        parent.html(template.build(viewModel));
        context.viewFactory.create(parent.find('[data-element=applicationBar]'), AppBarView, AppBarViewModel);

        navigation = new Navigation(parent.find('.navigation'));
        navigation.onNavigationChanged = handleNavigationChanged;

        updateOfflineWarning(viewModel.isServerOnline);
        createAndShowView();
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleFileDragOver(event) {
        if (viewModel.activeView !== 'FileUploadView') {
            event.stopPropagation();
            event.preventDefault();
            event.originalEvent.dataTransfer.dropEffect = 'copy';

            viewModel.showView('FileUploadView');
        }
    }

    /**
     * @param {string} viewReference
     */
    function handleNavigationChanged(viewReference) {
        viewModel.showView(viewReference);
    }

    /**
     * Switch to active panel.
     */
    function createAndShowView() {
        console.log('Create and show view', {view: viewModel.activeView});
        navigation.moveIndicatorTo(viewModel.activeView);

        var pageContainer = parent.find('[data-container=page]');

        if (panels[viewModel.activeView]) {
            if (activeView && activeView.dispose) {
                activeView.dispose();
            }

            var View = panels[viewModel.activeView].View;
            var ViewModel = panels[viewModel.activeView].ViewModel;

            activeView = context.viewFactory.create(pageContainer, View, ViewModel);

            if (activeView.activate) {
                activeView.activate(viewModel.activeViewData);
            }
        } else {
            console.error('No view found.', {activeView: viewModel.activeView });
        }

    }

    /**
     * @param {boolean} isOnline
     */
    function updateOfflineWarning(isOnline) {
        parent.find('[data-container=page]').toggle(isOnline);
        parent.find('[data-container=offlineWarning]').toggle(!isOnline);
    }

    constructor();
}

module.exports = WorkspaceView;
