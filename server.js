import app from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB();
app.listen(process.env.PORT, () => {
  console.log("Server started at port" + process.env.PORT);
});
