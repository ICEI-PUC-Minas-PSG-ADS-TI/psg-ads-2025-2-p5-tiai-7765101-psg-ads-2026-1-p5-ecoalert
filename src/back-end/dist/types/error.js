"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status, code, fields) {
        super(message);
        this.status = status;
        this.code = code;
        this.fields = fields;
    }
}
exports.AppError = AppError;
