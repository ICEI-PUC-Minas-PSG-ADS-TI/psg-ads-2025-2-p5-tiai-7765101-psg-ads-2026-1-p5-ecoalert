import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { userRoutes } from "./routes/user.routes";
import { communityRoutes } from "./routes/community.routes";

const app = express();
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/comunidades", communityRoutes);

export { app };
