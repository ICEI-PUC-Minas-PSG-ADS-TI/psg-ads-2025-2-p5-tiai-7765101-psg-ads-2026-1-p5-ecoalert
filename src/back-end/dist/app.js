"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = require("./routes/user.routes");
const community_routes_1 = require("./routes/community.routes");
const app = (0, express_1.default)();
exports.app = app;
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
app.use((0, cors_1.default)({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/users", user_routes_1.userRoutes);
app.use("/comunidades", community_routes_1.communityRoutes);
