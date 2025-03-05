import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import userRoutes from "./routes/userRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = 3000;

// middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  next();
});

app.use(
  cors({
    origin: ["http://127.0.0.1:8081", "http://localhost:8081"],
    methods: "GET, POST, PATCH, DELETE, PUT",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes middleware
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req:Request, res:Response) => {
  res.send("AgriSmart Server Running!");
})

app.listen(PORT, () => {
  console.log(`Node.js server running at http://localhost:${PORT}`);
});
