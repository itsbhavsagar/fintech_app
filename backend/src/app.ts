import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/properties";
import investmentRoutes from "./routes/investments";
import portfolioRoutes from "./routes/portfolio";
import watchlistRoutes from "./routes/watchlist";
import transactionsRoutes from "./routes/transactions";
import notificationsRoutes from "./routes/notifications";
import chatRoutes from "./routes/chat";
import messageRoutes from "./routes/messages";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

export default app;
