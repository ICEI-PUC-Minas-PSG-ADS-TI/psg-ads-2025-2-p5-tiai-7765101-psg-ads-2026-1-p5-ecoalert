import { Router } from "express";
import { userRoutes } from "./user.routes";

const routes = Router();

routes.use("/users", userRoutes);

routes.get("/", (req, res) => {
    return res.json({ message: "Hello World!" });
});

export { routes };