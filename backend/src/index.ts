import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = Number(process.env.PORT ?? 4000);

app.listen(port, "0.0.0.0", () => {
  console.log(`BrickShare backend listening on http://0.0.0.0:${port}`);
});
