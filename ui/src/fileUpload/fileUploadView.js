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
     * @type {yak.ui.AppBarView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('fileUpload');

    /**
     * @type {jQuery}
     */
    var fileDropZone = null;

    /**
     * Constructor
     */
    function constructor() {
        parent.html(template.build({ version: yak.ui.version}));

        fileDropZone = parent.find('.drop-block');

        fileDropZone.bind('drop', handleFileDrop);
        fileDropZone.bind('dragover', handleFileDragOver);
        fileDropZone.bind('dragleave', handleFileDragLeave);

        parent.find('[data-command=choose]').click(handleChooseCommand);
        parent.find('[name=fileInput]').change(handleFileInputChange);
    }

    function handleFileInputChange(event) {
        var files = parent.find('[name=fileInput]').get(0).files;
        readFiles(files);
    }

    function handleChooseCommand() {
        parent.find('[name=fileInput]').click();
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleFileDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.originalEvent.dataTransfer.dropEffect = 'copy';

        fileDropZone.attr('data-drag', 'over');
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleFileDragLeave(event) {
        fileDropZone.attr('data-drag', 'leave');
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleFileDrop(event) {
        console.log('handleJsFileDrop', event);
        fileDropZone.attr('data-drag', 'drop');

        event.stopPropagation();
        event.preventDefault();

        var files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files;

        readFiles(files);
    }

    /**
     * Read all files
     * @param {Array<File>} files
     */
    function readFiles(files) {
        console.log(files);
        viewModel.clearFileUploadInfo();
        _.each(files, readFile);
    }

    /**
     * Handle every dropped file.
     * @param {File} file
     */
    function readFile(file) {
        console.log('file uploaded', file);
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = _.partial(handleFileLoaded, file);

        viewModel.createFileUploadInfo(file.name);

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

        viewModel.uploadFile(fileName, content);
    }

    constructor();
};
