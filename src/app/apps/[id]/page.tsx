import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApp } from "@/lib/store/db";
import AppDetail from "./AppDetail";
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const item = getApp((await params).id);
 return item ? { title: `${item.name} | ResultScale AI`, description: item.shortDescription } : { title: "Not found | ResultScale AI" };
}
export default async function Page({ params }: Props) {
 if (!getApp((await params).id)) notFound();
 return <AppDetail />;
}
