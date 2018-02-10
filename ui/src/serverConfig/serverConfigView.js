const ServerConfigItem = require('./serverConfigItem');

/**
 * @constructor
 * @param {$} parent
 * @param {!ViewContext} context
 * @param {!ServerConfigViewModel} viewModel
 */
function ServerConfigView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {Template}
     */
    var template = context.template.load('serverConfig');

    this.activate = viewModel.activate;

    function constructor() {
        parent.html(template.build());

        viewModel.onServerConfigChanged = updateDom;

        parent.find('[data-element=save]').click(handleSaveCommand);
    }

    function updateDom() {
        findErrorMessageElement().hide();
        findHttpPortElement().val(viewModel.serverConfig.httpPort);
        findStaticRoutesElement().val(viewModel.serverConfig.staticRoutesText);
        findUseSecureConnectionElement().attr('checked', viewModel.serverConfig.useSecureConnection);
    }

    function handleSaveCommand() {
        var httPort = findHttpPortElement().val();
        var staticRoutesText = findStaticRoutesElement().val();

        var updateItem = new ServerConfigItem(httPort, staticRoutesText);
        updateItem.useSecureConnection = Boolean(findUseSecureConnectionElement()[0].checked);

        viewModel
            .update(updateItem)
            .catch(error => {
                findErrorMessageElement().html(error.message).show();
            });
    }

    /**
     * @returns {jQuery}
     */
    function findErrorMessageElement() {
        return parent.find('[data-element=errorMessage]');
    }

    /**
     * @returns {jQuery}
     */
    function findHttpPortElement() {
        return parent.find('[data-element=httpPort]');
    }

    /**
     * @returns {jQuery}
     */
    function findStaticRoutesElement() {
        return parent.find('[data-element=staticRoutes]');
    }

    /**
     * @returns {jQuery}
     */
    function findUseSecureConnectionElement() {
        return parent.find('[data-element=useSecureConnection]');
    }

    constructor();
}

module.exports = ServerConfigView;
