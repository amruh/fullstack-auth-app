import { getSessionCookies } from "@/lib/cookies";


export const fetchDashboardSummary = async () => {
  const session = getSessionCookies();
  
  try {
    const response = await fetch(
      "http://localhost:3001/api/dashboard/summary",
      {
        headers: {
          Cookie: `${session.name}=${session.value}`,
        },
        cache: "no-store",
      },
    );
    const dashboardSummary = (await response.json()) as {
      userCount: number;
      activeSession: number;
      averageActive7Days: number;
    };

    return dashboardSummary;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch 'dashboard summary'.");
  }
};
