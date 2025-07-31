import express, { Request, Response } from "express";
import { GlobalErrorHandler } from "./error/GlobalErrorHandler";
import { notFound } from "./error/notFound";
import { rootRoute } from "./routes";
import cors from "cors";
const app = express();



// middleware
app.use(express.json());
app.use(cors({ origin: ["http://localhost:8080"], credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({ message: "Alhamdulillah server is running" });
});

// all routes
app.use("/api/v1", rootRoute);

// global error handler
app.use(GlobalErrorHandler);
// not found handler
app.use(notFound);

export default app;