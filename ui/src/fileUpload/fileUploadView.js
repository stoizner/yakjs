/**
 * @constructor
 * @param {$} parent
 * @param {ViewContext} context
 * @param {FileUploadViewModel} viewModel
 */
function FileUploadView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {Template}
     */
    var template = context.template.load('fileUpload');

    /**
     * @type {Template}
     */
    var uploadReportTemplate = context.template.load('fileUploadReport');

    /**
     * @type {jQuery}
     */
    var fileDropZone = null;

    /**
     * @type {jQuery}
     */
    var progressBar;

    /**
     * @type {jQuery}
     */
    var progressSection;

    function constructor() {
        parent.html(template.build());

        fileDropZone = parent.find('.drop-block');
        progressBar = parent.find('.progress-block');
        progressSection = parent.find('[data-section=progress]');
        progressSection.hide();

        fileDropZone.bind('drop', handleFileDrop);
        fileDropZone.bind('dragover', handleFileDragOver);
        fileDropZone.bind('dragleave', handleFileDragLeave);

        parent.find('[data-command=choose]').click(handleChooseCommand);
        parent.find('[name=fileInput]').change(handleFileInputChange);

        viewModel.onFileUploadItemsChanged = updateUploadProgress;
        viewModel.onFileUploadCompleted = handleFileUploadCompleted;
    }

    /**
     * @param {Array<{}>} fileUploadItems
     */
    function updateUploadProgress(fileUploadItems) {
        var max = fileUploadItems.length;
        var uploaded = _.where(fileUploadItems, {pending: false}).length;

        var percent = Math.ceil(uploaded / max * 100);

        progressBar.find('.progress-block-text').text(percent + '%');
        progressBar.find('.progress-block-progress').attr('style', 'width: ' + percent + '%;');
    }

    /**
     * @param {Array<{}>} fileUploadItems
     */
    function handleFileUploadCompleted(fileUploadItems) {
        if (allUploadsSuccessfully(fileUploadItems)) {
            progressBar.attr('data-status', 'ok');
        } else {
            progressBar.attr('data-status', 'error');
        }

        var reportContainer = parent.find('[data-container]');

        var context = {
            items: fileUploadItems,
            allSuccess: _.every(fileUploadItems, function wasSuccessful(item) { return item.success; })
        };

        reportContainer.html(uploadReportTemplate.build(context));
    }

    /**
     *  @param {Array<{}>} fileUploadItems
     */
    function allUploadsSuccessfully(fileUploadItems) {
        return _.every(fileUploadItems, function(uploadItem) {
            return uploadItem.success;
        })
    }

    function handleFileInputChange(event) {
        var files = parent.find('[name=fileInput]').get(0).files;
        uploadFiles(files);
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
        uploadFiles(files);
    }

    /**
     * @param {Array<File>} files
     */
    function uploadFiles(files) {
        progressSection.show();
        progressBar.attr('data-status', '');
        viewModel.uploadFiles(files);
    }

    constructor();
}

module.exports = FileUploadView;
