import { Award, User } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EcommerceDashboardData } from "@/lib/google-sheets";

interface TopCustomersProps {
  customers?: EcommerceDashboardData["topCustomers"];
}

const defaultCustomers = [
  { id: "17850", name: "Customer #17850", totalSpend: "$5,391.21", orderCount: 17 },
  { id: "13047", name: "Customer #13047", totalSpend: "$3,210.50", orderCount: 9 },
  { id: "12583", name: "Customer #12583", totalSpend: "$2,840.00", orderCount: 6 },
  { id: "13767", name: "Customer #13767", totalSpend: "$1,950.80", orderCount: 5 },
  { id: "17920", name: "Customer #17920", totalSpend: "$1,420.00", orderCount: 4 },
];

export function TopCustomers({ customers }: TopCustomersProps) {
  const list = customers && customers.length > 0 ? customers : defaultCustomers;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Top VIP Buyers</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          Highest Lifetime Value
        </CardDescription>
        <CardAction>
          <Award className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {list.map((c) => (
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-2.5" key={c.id}>
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-full bg-muted">
                <User className="size-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{c.name}</span>
                <span className="text-muted-foreground text-xs">{c.orderCount} orders placed</span>
              </div>
            </div>
            <div className="font-medium font-mono text-sm tabular-nums">{c.totalSpend}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
