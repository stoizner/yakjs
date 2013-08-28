/**
 * Code Editor context for improved code completion.
 */
cobu.wsc.ui.codeEditorContext = {
    connection: {
        id: null,
        send: function(data) {}
    },
    message: {
        data: ''
    },
    instance: {
        name: '',
        description: '',
        port: 0,
        plugins:[],
        log: {
            info:function(){},
            warn:function(){},
            error:function(){}
        },
        state: ''
    }
};
