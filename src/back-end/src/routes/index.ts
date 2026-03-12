import { Router } from "express";
import { publicRoutes } from "./public.routes";
import { privateRoutes } from "./private.routes";

const routes = Router();

routes.use(publicRoutes);
routes.use(privateRoutes);

routes.get("/", (req, res) => {
    return res.json({ message: "Hello World!" });
});

export { routes };