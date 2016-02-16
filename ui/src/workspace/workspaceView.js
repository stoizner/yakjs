/**
 * WorkspaceView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.WorkspaceViewModel} viewModel
 */
yak.ui.WorkspaceView = function WorkspaceView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.WorkspaceView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('workspace');

    /**
     * @type {yak.ui.Navigation}
     */
    var navigation = null;

    /**
     * The current active view.
     * @type {{activate: function(), dispose: function()}}
     */
    var activeView = null;

    /**
     *  Constructor
     */
    function constructor() {
        parent.html(template.build());

        context.viewFactory.create($('.app-bar'), yak.ui.AppBarView, yak.ui.AppBarViewModel);

        navigation = new yak.ui.Navigation(parent.find('.navigation'));
        navigation.onNavigationChanged = handleNavigationChanged;
        viewModel.onActiveViewChanged = createAndShowView;

        parent.bind('dragover', handleFileDragOver);

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

        if (yak.ui[viewModel.activeView]) {
            if (activeView && activeView.dispose) {
                activeView.dispose();
            }

            var View = yak.ui[viewModel.activeView];
            var ViewModel = yak.ui[viewModel.activeView + 'Model'];

            activeView = context.viewFactory.create(pageContainer, View, ViewModel);

            if (activeView.activate) {
                activeView.activate(viewModel.activeViewData);
            }
        } else {
            console.error('No view found.', {activeView: viewModel.activeView });
        }

    }

    constructor();
};
