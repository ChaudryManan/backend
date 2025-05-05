import connectDB from "./db/index.js";
import app from "./app.js";

export async function init() {
  await connectDB();
  return app;
}

// (Optional) This part only runs locally (not in serverless environments)
if (process.env.NODE_ENV !== "production") {
  init().then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on port ${process.env.PORT || 8000}`);
    });

    app.on("error", (error) => {
      console.error("Server error:", error);
      throw error;
    });
  }).catch((error) => {
    console.error("There was an error in index.js:", error);
  });
}
