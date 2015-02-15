/**
 * GetLogInfoRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.GetLogInfoRequestHandler = function GetLogInfoRequestHandler(yakServer) {
    /**
     * @param {yak.api.GetLogInfoRequest} request
     * @returns {yak.api.GetLogInfoResponse} response
     */
    this.handle = function handle(request) {
        var logger = yakServer.getLogger();
        var response = new yak.api.GetLogInfoResponse(request.id);

        response.logs = logger.getLogs();

        return response;
    };
};
