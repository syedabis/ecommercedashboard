import { ArrowUpRight } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { EcommerceDashboardData } from "@/lib/google-sheets";

interface TopProductsProps {
  products?: EcommerceDashboardData["topProducts"];
}

const defaultProducts = [
  {
    name: "Linen Overshirt",
    stockCode: "85123A",
    share: "31%",
    sales: "$14,820",
    salesRaw: 14820,
  },
  {
    name: "Everyday Tote",
    stockCode: "71053",
    share: "24%",
    sales: "$11,460",
    salesRaw: 11460,
  },
  {
    name: "Ceramic Planter",
    stockCode: "84406B",
    share: "18%",
    sales: "$8,930",
    salesRaw: 8930,
  },
];

export function TopProducts({ products }: TopProductsProps) {
  const items = products && products.length > 0 ? products : defaultProducts;
  const topShareSum = items.reduce((acc, curr) => acc + (parseFloat(curr.share) || 0), 0).toFixed(0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Top Products</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          {topShareSum}% of total sales
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-3">
          <div className="text-muted-foreground text-xs">Products</div>
          <div className="text-muted-foreground text-xs">Share</div>
          <div className="text-muted-foreground text-xs">Sales</div>

          {items.map((product) => (
            <div className="contents text-sm" key={`${product.stockCode}-${product.name}`}>
              <div className="min-w-0">
                <div className="truncate font-medium" title={product.name}>
                  {product.name}
                </div>
                <div className="text-muted-foreground text-xs">SKU: {product.stockCode}</div>
              </div>
              <div className="self-center text-muted-foreground tabular-nums">{product.share}</div>
              <div className="self-center font-medium tabular-nums">{product.sales}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
