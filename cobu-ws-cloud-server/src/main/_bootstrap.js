console.log('start server');

var cloudServer = new cobu.wsc.CloudServer();

var serviceInstance = new cobu.wsc.WebSocketServerInstance('service', 8080);
serviceInstance.plugins.push(new cobu.wsc.ServicePlugin(cloudServer));
cloudServer.start(serviceInstance);

var instanceA = new cobu.wsc.WebSocketServerInstance('A', 8081);
//instanceA.plugins.push(new cobu.wsc.PingPongPluginWorker());
//instanceA.plugins.push(new cobu.wsc.BroadcastPluginWorker());

var instanceB = new cobu.wsc.WebSocketServerInstance('B', 8082);
//instanceB.plugins.push(new cobu.wsc.PingPongPluginWorker());
//instanceB.plugins.push(new cobu.wsc.EchoPluginWorker());


cloudServer.pluginManager.createOrUpdatePlugin('console', 'Hello World console output', 'function HelloWorld() { this.onMessage = function onMessage(message, connection, instance) { console.log("hello world"); }; }');

var echoPlugin = new cobu.wsc.Plugin();
echoPlugin.name = 'echo';
echoPlugin.description = 'Echo service. Every received message will be returned.';
echoPlugin.PluginWorker = cobu.wsc.EchoPluginWorker;
echoPlugin.code = cobu.wsc.EchoPluginWorker.toString();

cloudServer.pluginManager.addOrUpdatePlugin(echoPlugin);

cloudServer.addInstance(instanceA);
cloudServer.addInstance(instanceB);

console.log('server initialized. running...');




