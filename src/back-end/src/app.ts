import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { userRoutes } from "./routes/user.routes";
import { communityRoutes } from "./routes/community.routes";

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/comunidades", communityRoutes);

export { app };