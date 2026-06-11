"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.getUserById = getUserById;
exports.me = me;
const user_service_1 = require("@/services/user.service");
const error_1 = require("@/types/error");
async function getUsers(req, res) {
    return res.json(await user_service_1.UserService.findAll());
}
async function createUser(req, res) {
    const response = await user_service_1.UserService.create(req.body);
    return res.status(201).json(response);
}
async function getUserById(req, res) {
    const { id } = req.params;
    return res.json(await user_service_1.UserService.findById(id));
}
async function me(req, res) {
    const userId = req.user?.userId;
    if (!userId) {
        throw new error_1.AppError("Token inválido", 401, "Invalid token");
    }
    return res.json(await user_service_1.UserService.findById(userId));
}
