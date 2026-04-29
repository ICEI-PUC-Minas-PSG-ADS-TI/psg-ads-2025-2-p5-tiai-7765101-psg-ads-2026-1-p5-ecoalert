"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_neon_1 = require("@prisma/adapter-neon");
const serverless_1 = require("@neondatabase/serverless");
const dotenv_1 = __importDefault(require("dotenv"));
const ws_1 = __importDefault(require("ws"));
dotenv_1.default.config();
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const adapter = new adapter_neon_1.PrismaNeon({
    connectionString: process.env.DATABASE_URL
});
exports.prisma = new client_1.PrismaClient({ adapter });
