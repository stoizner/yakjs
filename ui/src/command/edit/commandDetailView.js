/* global CodeMirror:false */

var CommandDetailsItem = require('./commandDetailsItem');

/**
 * @constructor
 * @struct
 * @param {!jQuery} parent
 * @param {!ViewContext} context
 * @param {!CommandDetailViewModel} viewModel
 */
function CommandDetailView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {CodeMirror}
     */
    var codeEditor = null;

    /**
     * @type {!Template}
     */
    var template = context.template.load('commandDetailView');

    /**
     * @type {!Template}
     */
    var selectableListItemTemplate = context.template.load('selectableListItem');

    function constructor() {
        viewModel.item.subscribeAndInvoke(updateView);
        viewModel.commandItems.subscribeAndInvoke(updatePluginAndCommandList);
        viewModel.pluginItems.subscribeAndInvoke(updatePluginAndCommandList);
    }

    function updateView() {
        parent.html(template.build(viewModel));

        codeEditor = new CodeMirror(parent.find('[data-element=jsonEditor]')[0], {
            value:  '',
            mode:  {name: "javascript", json: true},
            lineNumbers: false,
            indentUnit: 4
        });

        parent.find('[data-element=save]').click(save);
        parent.find('[data-element=run]').click(run);
        parent.find('[data-element=create]').click(save);
        parent.find('[data-element=copy]').click(() => viewModel.copy());
        parent.find('[data-element=deleteButton]').click(handleDeleteCommand);
        parent.find('[data-element=cancelButton]').click(handleCancelCommand);

        parent.find('[data-element=prettify-json]').click(handlePrettifyJsonCommand);

        parent.find('[data-element=maximize-editor]').click(maximizeCodeEditor);
        parent.find('[data-element=minimize-editor]').click(minimizeCodeEditor);

        parent.find('[data-element=useGroupButton]').click(useGroupName);

        if (viewModel.item.value) {
            codeEditor.setValue(viewModel.item.value.commandData || '');
        }

        parent.find('[data-element=pluginList]').change(event => {
            viewModel.selectPlugin($(event.target).val());
        });

        minimizeCodeEditor();
    }

    function updatePluginAndCommandList() {
        var pluginList = parent.find('[data-element=pluginList]');
        pluginList.html(viewModel.pluginItems.value.map(selectableListItemTemplate.build));

        var commandList = parent.find('[data-element=commandList]');
        commandList.html(viewModel.commandItems.value.map(selectableListItemTemplate.build));
    }

    /**
     * @type {function(string)}
     */
    this.activate = viewModel.activate;

    function save() {
        viewModel.saveOrUpdate(getItemFromDom()).then(viewModel.showCommandListView);
    }

    function run() {
        var commandData = codeEditor.getValue();
        viewModel.runCommand(commandData);
    }

    function getItemFromDom() {
        var presetFullName = parseGroupPresetName(parent.find('[name=commandPresetName]').val());
        var item = new CommandDetailsItem(presetFullName.presetName);

        item.groupName = presetFullName.groupName;
        item.displayName = parent.find('[name=displayName]').val();
        item.commandName = parent.find('[data-element=commandList]').val();
        item.commandData = codeEditor.getValue();

        return item;
    }

    /**
     * The user can insert a preset name with a group like myGroup/foo
     * @param {string} text
     * @returns {{presetName: string, groupName: string}}
     */
    function parseGroupPresetName(text) {
        var parsedData = {
            presetName: text,
            groupName: null
        };

        var slashIndex = text.indexOf('/');
        if (slashIndex > 0) {
            parsedData.groupName = text.substring(0, slashIndex);
            parsedData.presetName = text.substring(slashIndex + 1);
        }

        return parsedData;
    }

    function handleCancelCommand() {
        viewModel.showCommandListView();
    }

    function handleDeleteCommand() {
        viewModel.deleteCommandPreset();
    }

    /**
     * Get the current editor content and if it is JSON prettify it.
     */
    function handlePrettifyJsonCommand(event) {
        var jsonText = codeEditor.getValue();
        try {
            var json = JSON.parse(jsonText);

            var space = event.ctrlKey ? 2 : 4;
            var prettyJsonText = JSON.stringify(json, null, space);

            codeEditor.setValue(prettyJsonText);
        } catch (ex) {
            // Do nothing, maybe it is not a valid json.
        }
    }

    function maximizeCodeEditor() {
        parent.find('[data-element=maximize-editor]').hide();
        parent.find('[data-element=minimize-editor]').show();

        parent.find('[data-section=config]').hide();
    }

    function minimizeCodeEditor() {
        parent.find('[data-element=maximize-editor]').show();
        parent.find('[data-element=minimize-editor]').hide();

        parent.find('[data-section=config]').show();
    }

    function useGroupName(event) {
        var groupName = $(event.target).attr('data-group-name');
        var presetNameInput = parent.find('[name=commandPresetName]');
        var presetNameInputValue = presetNameInput.val();
        var currentPresetName = presetNameInputValue.substring(presetNameInputValue.indexOf('/') + 1);

        presetNameInput.val(groupName + '/' + currentPresetName);
    }

    constructor();
}

module.exports = CommandDetailView;
