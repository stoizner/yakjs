/**
 * FileUploadView
 * @constructor
 * @param {$} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.FileUploadViewModel} viewModel
 */
yak.ui.FileUploadView = function FileUploadView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.HeaderView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('fileUpload');

    var fileDropZone = null;

    /**
     * Constructor
     */
    function constructor() {
        parent.html(template.build({ version: yak.ui.version}));

        fileDropZone = $('.drop-panel');

        fileDropZone.bind('drop', handleJsFileDrop);
        fileDropZone.bind('dragover', handleJsFileDragOver);
        fileDropZone.bind('dragleave', handleJsFileDragLeave);
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleJsFileDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.originalEvent.dataTransfer.dropEffect = 'copy';

        fileDropZone.addClass('mod-drag-over');
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleJsFileDragLeave(event) {
        fileDropZone.removeClass('mod-drag-over');
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleJsFileDrop(event) {
        console.log('handleJsFileDrop', event);
        fileDropZone.removeClass('mod-drag-over');

        event.stopPropagation();
        event.preventDefault();

        var files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files;
        console.log(files);

        _.each(files, handleDroppedFile);
    }

    /**
     * Handle every dropped file.
     * @param {File} file
     */
    function handleDroppedFile(file) {
        console.log('file uploaded', file);
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = _.partial(handleFileLoaded, file);

        // Read in the file as a data URL.
        reader.readAsText(file);
    }

    /**
     * Handle the load event from the FileReader.
     * @param {File} file
     * @param {?} event
     */
    function handleFileLoaded(file, event) {
        var fileName = file.name;
        var content = event.target.result;
//
//        var pluginName = fileName.substr(0, fileName.lastIndexOf('.js')).trim();
//        console.log({pluginName: pluginName, fileName: fileName, content: content});

        viewModel.uploadFile(fileName, content);
    }

    constructor();
};
