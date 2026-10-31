import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getApps, getUsers, getContactRequests, getOrders, getReports } from "@/lib/store/db";
export async function GET(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apps = getApps();
  const contacts = getContactRequests();
  const orders = getOrders();
  return NextResponse.json({
    apps: apps.map(({ id, name, downloads }) => ({ id, name, downloads })),
    totalApps: apps.length,
    totalDownloads: apps.reduce((sum, app) => sum + (Number(app.downloads) || 0), 0),
    activeUsers: getUsers().filter((user) => user.active).length,
    contacts: contacts.length, newContacts: contacts.filter((c) => c.status === "new").length,
    reports: getReports().length,
    orders: orders.map(({ reference, name, amount, currency, status, createdAt }) => ({ reference, name, amount, currency, status, createdAt })),
  });
}
