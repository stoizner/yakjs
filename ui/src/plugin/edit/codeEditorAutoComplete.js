/**
 * Auto Document
 * @param {CodeMirror} cm
 */
function codeEditorAutoComplete(cm) {
    CodeMirror.showHint(cm, CodeMirror.hint.javascript, { additionalContext: codeEditorContext });
}

module.exports = codeEditorAutoComplete;

