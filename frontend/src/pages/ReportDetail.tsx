import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import StatusBadge from "../components/StatusBadge";
import { useReportStore } from "../store/reportStore";
import { SkeletonBlock, SkeletonLine } from "../components/Skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ReportDetail() {
  const { id } = useParams();
  const report = useReportStore((state) => state.current);
  const loading = useReportStore((state) => state.loading);
  const error = useReportStore((state) => state.error);
  const loadReport = useReportStore((state) => state.loadReport);
  const updateStatus = useReportStore((state) => state.updateStatus);
  const generateSummary = useReportStore((state) => state.generateSummary);
  const [status, setStatus] = useState("UPLOADED");
  const [summary, setSummary] = useState("");
  const [localError, setLocalError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiNotes, setAiNotes] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    if (id) {
      loadReport(id).then(() => {
        if (report) {
          setStatus(report.status);
          setSummary(report.summary || "");
        }
      });
    }
  }, [id, loadReport]);

  useEffect(() => {
    if (report) {
      setStatus(report.status);
      setSummary(report.summary || "");
    }
  }, [report]);

  const handleUpdate = async () => {
    if (!id) {
      return;
    }
    setUpdating(true);
    setLocalError("");
    try {
      await updateStatus(id, status, summary);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to update report");
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!id) {
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const updated = await generateSummary(id, aiNotes.trim() ? aiNotes.trim() : undefined);
      setSummary(updated.summary || "");
      setStatus(updated.status);
      setAiOpen(false);
      setAiNotes("");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Failed to generate summary");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <SkeletonLine className="h-6 w-48" />
          <SkeletonBlock className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <SkeletonLine className="h-4 w-28" />
            <SkeletonLine className="mt-4 h-3 w-3/4" />
            <SkeletonLine className="mt-2 h-3 w-2/3" />
            <SkeletonLine className="mt-2 h-3 w-4/5" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <SkeletonLine className="h-4 w-36" />
            <SkeletonBlock className="mt-4 h-10 w-full" />
            <SkeletonBlock className="mt-4 h-28 w-full" />
            <SkeletonBlock className="mt-4 h-10 w-40" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <SkeletonLine className="h-4 w-32" />
            <SkeletonLine className="mt-4 h-3 w-11/12" />
            <SkeletonLine className="mt-2 h-3 w-10/12" />
          </div>
        </div>
      </section>
    );
  }

  if (!report) {
    return <ErrorBanner message="Report not found" />;
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">{report.name}</h2>
          <p className="mt-2 text-sm text-slate-600">Report detail and status control.</p>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <ErrorBanner message={localError || error} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="border border-border">
            <CardContent className="space-y-3 p-6">
              <h3 className="text-lg font-semibold">Metadata</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>Type: {report.type}</p>
                <p>Report date: {report.reportDate}</p>
                <p>Created: {new Date(report.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(report.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold">Status Update</h3>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="input"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="UPLOADED">UPLOADED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Summary generated by processing pipeline"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating ? "Saving" : "Save status"}
                </Button>
                <Dialog open={aiOpen} onOpenChange={setAiOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Generate AI summary</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate AI summary</DialogTitle>
                      <DialogDescription>
                        Add optional notes to shape the summary, then generate a draft.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                      <Label htmlFor="ai-notes">Notes for the summary</Label>
                      <Textarea
                        id="ai-notes"
                        value={aiNotes}
                        onChange={(event) => setAiNotes(event.target.value)}
                        placeholder="Ex: Highlight abnormal values or compare to previous reports."
                      />
                      {aiError ? <p className="text-sm text-red-600">{aiError}</p> : null}
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setAiOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleGenerateSummary} disabled={aiLoading}>
                        {aiLoading ? "Generating" : "Generate summary"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Summary Preview</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {report.summary || "Summary will appear here once completed."}
              </p>
            </CardContent>
          </Card>
        </div>
    </section>
  );
}
