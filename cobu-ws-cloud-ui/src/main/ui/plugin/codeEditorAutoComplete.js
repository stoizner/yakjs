/**
 * Auto Document
 * @param {CodeMirror} cm
 */
cobu.wsc.ui.codeEditorAutoComplete = function(cm) {
    CodeMirror.showHint(cm, CodeMirror.hint.javascript, { additionalContext: cobu.wsc.ui.codeEditorContext });
};
