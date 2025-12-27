import { config } from "dotenv";
import express from "express";
import cors from "cors";

config();
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
