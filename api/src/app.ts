import express from "express";
import googleRouter from "./http/google";
import graphqlRouter from "./http/graphql";
import cors from "cors";
import youtubeRouter from "./http/youtube";
import thumbnailRouter from "./http/thumbnail";

export const app = express();

app.use(cors({ origin: true, credentials: true }));

app.get("/health", (request, response) => {
  response.status(200).json({ healthy: true });
});
app.post("/health", (request, response) => {
  response.status(200).json({ healthy: true });
});

app.use("/google", googleRouter);
app.use("/youtube", youtubeRouter);
app.use("/thumbnail", thumbnailRouter);
app.use("/graphql", graphqlRouter);

export const api = (): Promise<void> =>
  new Promise((resolve) => {
    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
      resolve();
    });
  });

// This is for Vercel
export default app;
