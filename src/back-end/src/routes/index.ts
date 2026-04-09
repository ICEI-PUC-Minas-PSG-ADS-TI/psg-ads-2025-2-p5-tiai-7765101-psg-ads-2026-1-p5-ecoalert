import { Router } from "express";
import { publicRoutes } from "./public.routes";
import { privateRoutes } from "./private.routes";

const routes = Router();

routes.get("/", (req, res) => {
    return res.json({ message: "Hello World!" });
});

routes.use(publicRoutes);
routes.use(privateRoutes);

export { routes };