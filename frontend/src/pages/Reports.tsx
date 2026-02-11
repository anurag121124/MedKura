import { useEffect } from "react";
import { Link } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import StatusBadge from "../components/StatusBadge";
import { useReportStore } from "../store/reportStore";
import { SkeletonBlock, SkeletonLine } from "../components/Skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Reports() {
  const reports = useReportStore((state) => state.reports);
  const loading = useReportStore((state) => state.loading);
  const error = useReportStore((state) => state.error);
  const loadReports = useReportStore((state) => state.loadReports);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">Reports</h2>
          <p className="mt-2 text-sm text-slate-600">Monitor report processing and status updates.</p>
        </div>
        <Button asChild>
          <Link to="/upload">Upload report</Link>
        </Button>
      </div>
      <ErrorBanner message={error} />
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border border-border">
              <CardContent className="space-y-3 p-5">
                <SkeletonLine className="h-4 w-3/5" />
                <SkeletonLine className="h-3 w-1/3" />
                <SkeletonBlock className="h-6 w-24" />
                <SkeletonLine className="h-3 w-4/5" />
                <SkeletonLine className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reports.length === 0 ? (
            <div className="glass-card flex min-h-[180px] items-center justify-center text-sm text-slate-500">
              No reports yet. Upload your first report.
            </div>
          ) : (
            reports.map((report) => (
              <Link
                to={`/reports/${report.id}`}
                key={report.id}
                className="group"
              >
                <Card className="border border-border transition hover:bg-muted/30">
                  <CardContent className="flex flex-col gap-4 p-5">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900">{report.name}</h3>
                      <p className="text-sm text-slate-500">{report.type}</p>
                    </div>
                    <StatusBadge status={report.status} />
                    <div className="space-y-1 text-xs text-slate-500">
                      <p>Report date: {report.reportDate}</p>
                      <p>Updated: {new Date(report.updatedAt).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}
