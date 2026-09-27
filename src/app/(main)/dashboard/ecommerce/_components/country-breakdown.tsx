import { Globe } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EcommerceDashboardData } from "@/lib/google-sheets";

interface CountryBreakdownProps {
  data?: EcommerceDashboardData["countryBreakdown"];
}

const defaultCountries = [
  { country: "United Kingdom", sales: 88450, orders: 254, percentage: "85.0%" },
  { country: "Germany", sales: 6200, orders: 18, percentage: "6.0%" },
  { country: "France", sales: 4800, orders: 14, percentage: "4.6%" },
  { country: "EIRE", sales: 2500, orders: 8, percentage: "2.4%" },
  { country: "Spain", sales: 2100, orders: 6, percentage: "2.0%" },
];

export function CountryBreakdown({ data }: CountryBreakdownProps) {
  const countries = data && data.length > 0 ? data : defaultCountries;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Geographic Sales</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          Top Markets by Revenue
        </CardDescription>
        <CardAction>
          <Globe className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {countries.slice(0, 5).map((item) => (
            <div className="flex flex-col gap-1" key={item.country}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.country}</span>
                <span className="font-mono text-muted-foreground tabular-nums">
                  ${item.sales.toLocaleString()} ({item.percentage})
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${Math.min(parseFloat(item.percentage) || 10, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
