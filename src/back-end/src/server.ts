import { app } from "./app";
import { errorMiddleware } from "./middlewares/error.middleware";
import { routes } from "./routes";

const PORT = process.env.PORT || 3000;

app.use("/api", routes);
app.use(errorMiddleware)

app.listen(PORT, () => {
});
