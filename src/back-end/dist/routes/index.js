"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const public_routes_1 = require("./public.routes");
const private_routes_1 = require("./private.routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.get("/", (req, res) => {
    return res.json({ message: "Hello World!" });
});
routes.use(public_routes_1.publicRoutes);
routes.use(private_routes_1.privateRoutes);
