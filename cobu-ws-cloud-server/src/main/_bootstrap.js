var cloudServer = new cobu.wsc.CloudServer();

var serviceInstance = new cobu.wsc.WebSocketServerInstance('service', 8080);
serviceInstance.plugins.push(new cobu.wsc.ServicePlugin(cloudServer));
cloudServer.start(serviceInstance);

var instanceA = new cobu.wsc.WebSocketServerInstance('A', 8081);
instanceA.plugins.push(new cobu.wsc.PingPongPlugin());
instanceA.plugins.push(new cobu.wsc.BroadcastPlugin());

var instanceB = new cobu.wsc.WebSocketServerInstance('B', 8082);
instanceB.plugins.push(new cobu.wsc.PingPongPlugin());
instanceB.plugins.push(new cobu.wsc.EchoPLugin());

cloudServer.addInstance(instanceA);
cloudServer.addInstance(instanceB);

