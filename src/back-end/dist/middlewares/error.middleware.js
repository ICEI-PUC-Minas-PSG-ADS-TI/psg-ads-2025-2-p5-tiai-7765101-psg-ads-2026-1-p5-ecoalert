"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const error_1 = require("@/types/error");
function errorMiddleware(error, req, res, next) {
    if (error instanceof error_1.AppError) {
        return res.status(error.status).json({
            message: error.message,
            status: error.status,
            code: error.code,
            fields: error.fields ?? null
        });
    }
    return res.status(500).json({
        message: 'Internal server error',
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        fields: null
    });
}
