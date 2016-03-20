var _ = require('underscore');

(function bootstrap() {
    // Set up the global logging.
    yak.log = new yak.Log('INFO');

    var yakServer = new yak.YakServer();
    yakServer.start();
}());
