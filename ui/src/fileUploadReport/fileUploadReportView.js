/**
 * FileUploadReportView
 * @constructor
 * @param {$} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.FileUploadReportViewModel} viewModel
 */
yak.ui.FileUploadReportView = function FileUploadReportView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.FileUploadReportView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('fileUploadReport');

    /**
     * @type {yak.ui.Template}
     */
    var itemTemplate = context.template.load('fileUploadReportItem');

    /**
     * Constructor
     */
    function constructor() {
        parent.html(template.build());
        parent.hide();

        context.ko.applyBindings(self, parent[0]);
        updateList();

        viewModel.onUploadedFilesChanged = handleUploadedFilesChanged;
    }

    /**
     * @param {?} event
     */
    this.handleOkClick = function handleOkClick(event) {
        parent.hide();
    };

    /**
     * Create the item list.
     */
    function updateList() {
        var html = '';
        var itemContainer = $('.list', parent);

        viewModel.uploadedFiles.sort(yak.ui.successCompare);

        _.each(viewModel.uploadedFiles, function toHTML(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);
    }

    /**
     * Handle event if files have been uploaded and display the file upload report.
     */
    function handleUploadedFilesChanged() {
        parent.show();
        updateList();
    }

    constructor();
};
