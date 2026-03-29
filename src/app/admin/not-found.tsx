import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <h2 className="text-2xl font-bold">Admin Resource Not Found</h2>
      <p className="text-muted-foreground mt-2">The admin page or resource you are looking for does not exist.</p>
      <Button asChild className="mt-6">
        <Link href="/admin">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
