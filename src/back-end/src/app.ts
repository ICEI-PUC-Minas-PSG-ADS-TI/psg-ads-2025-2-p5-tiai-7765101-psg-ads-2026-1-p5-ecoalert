import express from 'express';
import cors from 'cors';
<<<<<<< HEAD

const app = express();

app.use(cors());

=======
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(cookieParser());
>>>>>>> 10bf5e14633a2f9f67a002c787d6d7ae7d33ea13
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export { app };