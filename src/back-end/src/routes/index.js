import { Router } from "express";
import { userRoutes } from "./user.routes.js";

const routes = Router();

routes.use("/users", userRoutes);

routes.get("/", (req, res) => {
    res.send("Hello World!");
});

export { routes };