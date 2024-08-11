import express from "express";
import { prisma } from "../lib/db.js";
import { authenticate } from "../middleware/authenticate.js";

export const dashboardRouter = express.Router();

dashboardRouter.get("/api/dashboard/summary", authenticate, async (_, res) => {
  // Count user
  const userCount = await prisma.user.count();

  // Count session
  const activeSession = await prisma.session.count();

  // Date of 7 days ago
  const past7Days = new Date();
  past7Days.setDate(past7Days.getDate() - 7);

  // Display past 7 days session data
  const sessionPast7Days = await prisma.session.findMany({
    where: {
      createdAt: {
        lte: new Date(),
        gte: past7Days,
      },
    },
  });

  // Count average session in past 7 days, using math ceil to round the result
  const averageActive7Days = Math.ceil(sessionPast7Days.length / 7);

  res.json({
    userCount,
    activeSession,
    averageActive7Days,
  });
});
