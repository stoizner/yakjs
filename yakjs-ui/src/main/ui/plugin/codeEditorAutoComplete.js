/**
 * Auto Document
 * @param {CodeMirror} cm
 */
yak.ui.codeEditorAutoComplete = function(cm) {
    CodeMirror.showHint(cm, CodeMirror.hint.javascript, { additionalContext: yak.ui.codeEditorContext });
};
