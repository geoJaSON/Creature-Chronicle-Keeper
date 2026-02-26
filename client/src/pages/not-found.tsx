import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="text-center space-y-4 px-4">
        <div className="font-mono text-6xl text-muted-foreground select-none">??</div>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground text-sm">
          This location doesn't exist. Head back to familiar territory.
        </p>
        <Button asChild data-testid="button-home">
          <Link href="/">
            <MapPin className="w-4 h-4 mr-2" /> Back to Town Square
          </Link>
        </Button>
      </div>
    </div>
  );
}
