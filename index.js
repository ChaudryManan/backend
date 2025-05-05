import connectDB from "./db/index.js";
import app from "./app.js";

let isInitialized = false;

export async function init() {
  if (!isInitialized) {
    await connectDB();
    isInitialized = true;
  }
  return app;
}

// Local dev setup
if (process.env.NODE_ENV !== "production") {
  init().then(appInstance => {
    const PORT = process.env.PORT || 8000;
    appInstance.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error("Initialization failed:", err);
    process.exit(1);
  });
}