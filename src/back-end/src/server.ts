import { app } from "./app";
import { routes } from "./routes";

const PORT = process.env.PORT || 3000;

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});