import { format } from "date-fns";
import { RefreshCw, Settings2 } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { fetchEcommerceSheetData } from "@/lib/google-sheets";

import { CountryBreakdown } from "./_components/country-breakdown";
import { KpiStrip } from "./_components/kpi-strip";
import { RecentOrders } from "./_components/recent-orders";
import { TopCustomers } from "./_components/top-customers";
import { TopProducts } from "./_components/top-products";

export const metadata: Metadata = {
  title: "E-commerce Dashboard | Google Sheets Connected",
  description:
    "Explore e-commerce sales performance, top products, orders, and customer KPIs powered by live Google Sheets data.",
  alternates: {
    canonical: "/dashboard/ecommerce",
  },
};

export default async function Page() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");
  const sheetData = await fetchEcommerceSheetData();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl leading-none tracking-tight">Ecommerce Data Dashboard</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-600 text-xs dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Google Sheet Connected
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {formattedDate} • Syncing with <code className="font-mono text-xs">EcommerceData</code>
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
          <Select defaultValue="all-time">
            <SelectTrigger className="w-34" id="ecommerce-period" size="sm">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" />

          <Button size="icon-sm" variant="outline" title="Connected to Google Sheets">
            <RefreshCw className="size-3.5 text-muted-foreground" />
          </Button>

          <Button size="icon-sm" variant="outline">
            <Settings2 />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <KpiStrip data={sheetData} />

        <div className="xl:col-span-4">
          <TopProducts products={sheetData?.topProducts} />
        </div>

        <div className="xl:col-span-4">
          <CountryBreakdown data={sheetData?.countryBreakdown} />
        </div>

        <div className="xl:col-span-4">
          <TopCustomers customers={sheetData?.topCustomers} />
        </div>

        <div className="xl:col-span-12">
          <RecentOrders orders={sheetData?.recentOrders} />
        </div>
      </div>
    </div>
  );
}
