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
    }

    function handleSaveCommand() {
        var httPort = findHttpPortElement().val();
        var staticRoutesText = findStaticRoutesElement().val();

        viewModel
            .update(new ServerConfigItem(httPort, staticRoutesText))
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

    constructor();
}

module.exports = ServerConfigView;
