import express, { Express, Request, Response} from "express";
import router from "./router/Router";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

app.use(express.json({ limit: "10mb" }));

// Is this necessary?
// No, it's not necessary in localHost.
// In prod is necessary.
// app.set("trust proxy", 1);

const allowedOrigins = [
  `http://localhost:${process.env.PORT}`
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    };
  }
}));

app.use("/helloWorld", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

app.use("/api", router);

export default app;