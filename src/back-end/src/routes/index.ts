import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);

routes.get("/", (req, res) => {
    return res.json({ message: "Hello World!" });
});

export { routes };