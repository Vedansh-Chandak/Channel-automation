import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

await connectDB();

const PORT = process.env.PORT || 5000;

console.log("Before listen");

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

server.on("error", (err) => {
  console.error(err);
});