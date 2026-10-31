import CheckoutForm from "./CheckoutForm";
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
 const params = await searchParams;
 const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
 return <CheckoutForm selection={{ productId: value("product"), kind: value("kind"), interval: value("interval") || "month" }} />;
}
