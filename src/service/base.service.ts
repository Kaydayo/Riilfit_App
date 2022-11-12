class BaseService {

    sendSuccessResponse = (payload, message, statusCode?) => ({
        success: true,
        payload,
        message,
        statusCode: statusCode ? statusCode : 200
    });

    sendFailedResponse = (payload, message, statusCode?) => ({
        success: false,
        payload,
        message,
        statusCode: statusCode ? statusCode : 400
    });
}

export default BaseService;
