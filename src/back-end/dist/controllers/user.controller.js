"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.getUserById = getUserById;
const user_service_1 = require("@/services/user.service");
async function getUsers(req, res) {
    return res.json(await user_service_1.UserService.findAll());
}
async function createUser(req, res) {
    console.log("Received request to create user with body:", req.body);
    const response = await user_service_1.UserService.create(req.body);
    return res.status(201).json(response);
}
async function getUserById(req, res) {
    const { id } = req.params;
    return res.json(await user_service_1.UserService.findById(id));
}
