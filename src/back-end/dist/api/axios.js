"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
exports.api = axios_1.default.create({
    timeout: 10000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});
