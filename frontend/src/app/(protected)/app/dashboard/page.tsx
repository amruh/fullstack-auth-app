import UsersTable from "./table";
import { Suspense } from "react";
import { fetchUserInfo } from "@/data/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChartIcon,
  PersonIcon,
  RadiobuttonIcon,
} from "@radix-ui/react-icons";
import { fetchDashboardSummary } from "@/data/dashboard";

export default async function DashboardPage() {
  const userInfo = await fetchUserInfo();
  const dashboardSummary = await fetchDashboardSummary();

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="font-bold">Dashboard</h1>
        <p className="font-medium">Hi, {userInfo?.username}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card x-chunk="A card showing the total revenue in USD and the percentage difference from last month.">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <PersonIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary.userCount}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="A card showing the total subscriptions and the percentage difference from last month.">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Online Users Today
            </CardTitle>
            <RadiobuttonIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary.activeSession}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="A card showing the total sales and the percentage difference from last month.">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Online Users Past 7 Days
            </CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary.averageActive7Days}
            </div>
          </CardContent>
        </Card>
      </div>
      <Suspense key={"dashboard-page-table"} fallback={"Loading..."}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
