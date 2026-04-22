import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground mt-2">Page not found</p>
      <Button asChild className="mt-6">
        <Link href="/admin">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
