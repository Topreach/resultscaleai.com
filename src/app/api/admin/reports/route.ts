import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getReports, saveReports, type SecurityReport } from "@/lib/store/db";
export async function GET(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getReports());
}
export async function POST(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.client !== "string" || !body.client.trim() || body.client.length > 150 || typeof body.type !== "string" || !body.type.trim() || body.type.length > 150 || typeof body.summary !== "string" || body.summary.length > 20000 || !Number.isSafeInteger(body.findings) || body.findings < 0 || !Number.isSafeInteger(body.critical) || body.critical < 0 || body.critical > body.findings || !["Completed", "In Progress"].includes(body.status)) return NextResponse.json({ error: "Enter valid report details. Critical findings cannot exceed total findings." }, { status: 400 });
    const report: SecurityReport = { id: crypto.randomUUID(), client: body.client.trim(), type: body.type.trim(), summary: body.summary, findings: body.findings, critical: body.critical, status: body.status, date: new Date().toISOString().slice(0, 10) };
    saveReports([...getReports(), report]);
    return NextResponse.json(report, { status: 201 });
  } catch { return NextResponse.json({ error: "Could not create report" }, { status: 400 }); }
}
export async function DELETE(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  const reports = getReports();
  if (!reports.some((r) => r.id === id)) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  saveReports(reports.filter((r) => r.id !== id));
  return NextResponse.json({ success: true });
}
