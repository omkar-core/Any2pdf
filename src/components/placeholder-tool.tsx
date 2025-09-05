import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileClock } from "lucide-react";

interface PlaceholderToolProps {
  title: string;
  description: string;
}

export function PlaceholderTool({ title, description }: PlaceholderToolProps) {
  return (
    <Card className="shadow-lg border-2 border-dashed border-border bg-background/50 text-center">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center p-8 md:p-12">
            <FileClock className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Feature Coming Soon</h3>
            <p className="text-muted-foreground mt-2">This tool is currently under development.</p>
        </div>
      </CardContent>
    </Card>
  );
}
