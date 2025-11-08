// server/index.ts
import express from "express";
import { registerRoutes } from "./routes.js";

const app = express();

// keep raw body for any webhook-style handlers
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

(async () => {
  // register all API routes and get the http.Server back
  const httpServer = await registerRoutes(app);

  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";

  httpServer.listen(port, host, () => {
    console.log(`serving on http://${host}:${port}`);
  });
})().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
