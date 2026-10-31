import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/store/db";
import BlogArticle from "./BlogArticle";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const item = getBlogPost((await params).slug);
 return item ? { title: `${item.title} | ResultScale AI`, description: item.excerpt } : { title: "Not found | ResultScale AI" };
}
export default async function Page({ params }: Props) {
 if (!getBlogPost((await params).slug)) notFound();
 return <BlogArticle />;
}
