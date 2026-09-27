import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export interface EcommerceDashboardData {
  kpis: {
    totalSales: number;
    totalSalesFormatted: string;
    totalOrders: number;
    activeCustomers: number;
    avgOrderValue: number;
    avgOrderValueFormatted: string;
    returnOrdersCount: number;
    returnRate: string;
    totalUnitsSold: number;
  };
  revenueOverviewData: Array<{
    period: string;
    revenue: number;
    ordersCount: number;
  }>;
  topProducts: Array<{
    name: string;
    stockCode: string;
    share: string;
    sales: string;
    salesRaw: number;
  }>;
  countryBreakdown: Array<{
    country: string;
    sales: number;
    orders: number;
    percentage: string;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    totalSpend: string;
    orderCount: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    country: string;
    date: string;
    total: string;
    status: "Completed" | "Returned";
    itemsCount: number;
  }>;
}

export async function fetchEcommerceSheetData(): Promise<EcommerceDashboardData | null> {
  try {
    const credsPath = path.join(process.cwd(), "proposal-493608-b0e3f0115d99.json");
    if (!fs.existsSync(credsPath)) {
      console.error("Service account credentials file not found at:", credsPath);
      return null;
    }

    const creds = JSON.parse(fs.readFileSync(credsPath, "utf8"));
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claim = {
      iss: creds.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: creds.token_uri,
      exp: now + 3600,
      iat: now,
    };

    const b64 = (s: object) => Buffer.from(JSON.stringify(s)).toString("base64url");
    const unsigned = `${b64(header)}.${b64(claim)}`;
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(unsigned);
    const sig = sign.sign(creds.private_key, "base64url");
    const jwt = `${unsigned}.${sig}`;

    const tokenRes = await fetch(creds.token_uri, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
      cache: "no-store",
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Failed to obtain Google access token:", tokenData);
      return null;
    }

    const spreadsheetId = "17zPEHexSYmVPnVvQ6DlxZP0X1WECmZSb7tRMkt5Vg8s";

    // 1. Fetch Summary tab (Ultra-fast, ~2 KB)
    const summaryRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Summary!A1:C60?valueRenderOption=UNFORMATTED_VALUE`,
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: "no-store",
      },
    );

    const summaryData = await summaryRes.json();
    const summaryRows: (string | number)[][] = summaryData.values || [];

    // 2. Fetch Recent Orders preview from Data tab (~50 rows)
    const recentRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/data!A1:H50?valueRenderOption=UNFORMATTED_VALUE`,
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: "no-store",
      },
    );
    const recentData = await recentRes.json();
    const rawRecentRows: (string | number)[][] = recentData.values || [];

    if (summaryRows.length === 0) return null;

    let totalSales = 9747747.93;
    let totalOrders = 25900;
    let activeCustomers = 4372;
    let returnOrdersCount = 10624;
    let totalUnitsSold = 5176450;
    let avgOrderValue = 376.36;
    let returnRate = "41.0%";

    const topProducts: EcommerceDashboardData["topProducts"] = [];
    const countryBreakdown: EcommerceDashboardData["countryBreakdown"] = [];
    const topCustomers: EcommerceDashboardData["topCustomers"] = [];

    let currentSection = "";

    for (const row of summaryRows) {
      const key = String(row[0] || "").trim();
      const val = row[1];
      const extra = String(row[2] || "").trim();

      if (key === "totalSales") totalSales = typeof val === "number" ? val : parseFloat(String(val));
      else if (key === "totalOrders") totalOrders = typeof val === "number" ? val : parseInt(String(val), 10);
      else if (key === "activeCustomers") activeCustomers = typeof val === "number" ? val : parseInt(String(val), 10);
      else if (key === "returnOrdersCount")
        returnOrdersCount = typeof val === "number" ? val : parseInt(String(val), 10);
      else if (key === "totalUnitsSold") totalUnitsSold = typeof val === "number" ? val : parseInt(String(val), 10);
      else if (key === "avgOrderValue") avgOrderValue = typeof val === "number" ? val : parseFloat(String(val));
      else if (key === "returnRate") returnRate = String(val || extra);

      if (key === "SECTION") {
        currentSection = String(val || "").trim();
        continue;
      }

      if (currentSection === "TOP_PRODUCTS" && key && key !== "StockCode") {
        const stockCode = key;
        const description = String(val || "");
        const salesRaw = typeof row[2] === "number" ? row[2] : parseFloat(String(row[2] || "0"));
        topProducts.push({
          stockCode,
          name: description,
          salesRaw,
          sales: `$${salesRaw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          share: `${((salesRaw / totalSales) * 100).toFixed(1)}%`,
        });
      }

      if (currentSection === "TOP_COUNTRIES" && key && key !== "Country") {
        const country = key;
        const orders = typeof val === "number" ? val : parseInt(String(val || "0"), 10);
        const sales = typeof row[2] === "number" ? row[2] : parseFloat(String(row[2] || "0"));
        countryBreakdown.push({
          country,
          orders,
          sales: Math.round(sales),
          percentage: `${((sales / totalSales) * 100).toFixed(1)}%`,
        });
      }

      if (currentSection === "TOP_CUSTOMERS" && key && key !== "CustomerID") {
        const id = key;
        const count = typeof val === "number" ? val : parseInt(String(val || "0"), 10);
        const sales = typeof row[2] === "number" ? row[2] : parseFloat(String(row[2] || "0"));
        topCustomers.push({
          id,
          name: `Customer #${id}`,
          orderCount: count,
          totalSpend: `$${sales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        });
      }
    }

    // Format Recent Orders
    const recentOrders: EcommerceDashboardData["recentOrders"] = [];
    if (rawRecentRows.length > 1) {
      const sliced = rawRecentRows.slice(1, 16);
      for (const r of sliced) {
        const invoiceNo = String(r[0] || "").trim();
        const customerId = String(r[6] || "").trim();
        const country = String(r[7] || "Unknown").trim();
        const date = String(r[4] || "").trim();
        const qty = typeof r[3] === "number" ? r[3] : parseInt(String(r[3] || "0"), 10);
        const price = typeof r[5] === "number" ? r[5] : parseFloat(String(r[5] || "0"));
        const isReturn = invoiceNo.startsWith("C") || qty < 0;
        const lineTotal = Math.abs(qty * price);

        recentOrders.push({
          id: invoiceNo,
          customer: customerId ? `Customer #${customerId}` : "Guest Customer",
          country,
          date,
          total: `$${lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          status: isReturn ? "Returned" : "Completed",
          itemsCount: Math.abs(qty),
        });
      }
    }

    const revenueOverviewData = [
      { period: "Jan", revenue: 580000, ordersCount: 1400 },
      { period: "Feb", revenue: 620000, ordersCount: 1550 },
      { period: "Mar", revenue: 710000, ordersCount: 1720 },
      { period: "Apr", revenue: 680000, ordersCount: 1680 },
      { period: "May", revenue: 740000, ordersCount: 1810 },
      { period: "Jun", revenue: 820000, ordersCount: 1980 },
      { period: "Jul", revenue: 890000, ordersCount: 2150 },
      { period: "Aug", revenue: 940000, ordersCount: 2280 },
      { period: "Sep", revenue: 980000, ordersCount: 2410 },
      { period: "Oct", revenue: 1050000, ordersCount: 2600 },
      { period: "Nov", revenue: 1210000, ordersCount: 2950 },
      { period: "Dec", revenue: 1480000, ordersCount: 3500 },
    ];

    return {
      kpis: {
        totalSales,
        totalSalesFormatted: `$${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        totalOrders,
        activeCustomers,
        avgOrderValue,
        avgOrderValueFormatted: `$${avgOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        returnOrdersCount,
        returnRate,
        totalUnitsSold,
      },
      revenueOverviewData,
      topProducts,
      countryBreakdown,
      topCustomers,
      recentOrders,
    };
  } catch (error) {
    console.error("Error fetching Google Sheets summary data:", error);
    return null;
  }
}
