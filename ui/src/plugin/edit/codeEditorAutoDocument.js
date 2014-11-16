/**
 * Auto Document
 * @param {CodeMirror} cm
 */
yak.ui.codeEditorAutoDocument = function(cm) {
    'use strict';

    var cursor = cm.getCursor();
    console.log(cursor);
    cm.setCursor(cursor.line, 0);
    cm.replaceSelection('\n');
    cm.setCursor(cursor.line, 0);
    cm.replaceSelection('/**\n * \n */');
    cm.setCursor(cursor.line+1, cursor.ch);
};
