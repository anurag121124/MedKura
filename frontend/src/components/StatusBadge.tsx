import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  UPLOADED: "bg-secondary/20 text-secondary-foreground",
  PROCESSING: "bg-sky-100 text-sky-700",
  COMPLETED: "bg-emerald-100 text-emerald-700"
};

export default function StatusBadge({ status }: { status: string }) {
  const className = statusColors[status] || "bg-muted text-muted-foreground";
  return <Badge className={className}>{status}</Badge>;
}
