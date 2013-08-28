console.log('start server');

var cloudServer = new cobu.wsc.CloudServer();

var serviceInstance = new cobu.wsc.ServiceInstance('service', 8790, cloudServer);
cloudServer.start(serviceInstance);


var instanceA = new cobu.wsc.WebSocketInstance('A', 8081, cloudServer);
instanceA.description = 'test-csu';
instanceA.plugins.push('echo');
instanceA.plugins.push('console');
//instanceA.plugins.push(new cobu.wsc.PingPongPluginWorker());
//instanceA.plugins.push(new cobu.wsc.BroadcastPluginWorker());


var instanceB = new cobu.wsc.WebSocketInstance('B', 8082, cloudServer);
//instanceB.plugins.push(new cobu.wsc.PingPongPluginWorker());
//instanceB.plugins.push(new cobu.wsc.EchoPluginWorker());


cloudServer.pluginManager.createOrUpdatePlugin('console', 'Hello World console output', 'function HelloWorld() { this.onMessage = function onMessage(message, connection, instance) { console.log("hello world"); }; }');

var echoPlugin = new cobu.wsc.Plugin();
echoPlugin.name = 'echo';
echoPlugin.description = 'Echo service. Every received message will be returned.';
echoPlugin.PluginWorker = cobu.wsc.EchoPluginWorker;
echoPlugin.code = cobu.wsc.EchoPluginWorker.toString();

cloudServer.pluginManager.addOrUpdatePlugin(echoPlugin);

var pingpongPlugin = new cobu.wsc.Plugin();
pingpongPlugin.name = 'ping-pong';
pingpongPlugin.description = 'ping will be answered with pong';
pingpongPlugin.PluginWorker = cobu.wsc.PingPongPluginWorker;
pingpongPlugin.code = cobu.wsc.PingPongPluginWorker.toString();

cloudServer.pluginManager.addOrUpdatePlugin(pingpongPlugin);


//instanceA.plugins.push(cloudServer.pluginManager.createPluginWorker('echo'));
//instanceA.plugins.push(cloudServer.pluginManager.createPluginWorker('console'));

cloudServer.addInstance(instanceA);
cloudServer.addInstance(instanceB);

console.log('server initialized. running...');




