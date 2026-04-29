"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const error_middleware_1 = require("./middlewares/error.middleware");
const routes_1 = require("./routes");
const PORT = process.env.PORT || 3000;
app_1.app.use("/api", routes_1.routes);
app_1.app.use(error_middleware_1.errorMiddleware);
app_1.app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
