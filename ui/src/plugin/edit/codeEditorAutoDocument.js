/**
 * Auto Document
 * @param {CodeMirror} cm
 */
function codeEditorAutoDocument(cm) {
    'use strict';

    var cursor = cm.getCursor();
    console.log(cursor);
    cm.setCursor(cursor.line, 0);
    cm.replaceSelection('\n');
    cm.setCursor(cursor.line, 0);
    cm.replaceSelection('/**\n * \n */');
    cm.setCursor(cursor.line+1, cursor.ch);
}

module.exports = codeEditorAutoDocument;
