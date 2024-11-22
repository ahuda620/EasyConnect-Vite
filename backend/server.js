import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";

console.log(`Running in ${process.env.NODE_ENV} mode`);

if (process.env.NODE_ENV === "development") {
  app.listen(4000, "0.0.0.0", () =>
    console.log("Server is running on port 4000")
  );
} else {
  app.listen(4000, () => console.log("Server is running on port 4000"));
}
