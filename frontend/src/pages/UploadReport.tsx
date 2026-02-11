import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import { useReportStore } from "../store/reportStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadReport() {
  const [name, setName] = useState("");
  const [type, setType] = useState("PDF");
  const [reportDate, setReportDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const loading = useReportStore((state) => state.loading);
  const upload = useReportStore((state) => state.upload);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("reportDate", reportDate);
      if (file) {
        formData.append("file", file);
      }
      await upload(formData);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload report");
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Upload Report</h2>
        <p className="mt-2 text-sm text-slate-600">Attach your medical report with metadata for tracking.</p>
      </div>
      <ErrorBanner message={error} />
      <Card className="border border-border">
        <CardContent className="p-6">
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="report-name">Report name</Label>
              <Input
                id="report-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="report-type">Report type</Label>
              <select
                id="report-type"
                className="input"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="PDF">PDF</option>
                <option value="IMAGE">Image</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="report-date">Report date</Label>
              <Input
                id="report-date"
                type="date"
                value={reportDate}
                onChange={(event) => setReportDate(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="report-file">File</Label>
              <Input
                id="report-file"
                type="file"
                accept="application/pdf,image/*"
                onChange={(event) => setFile(event.target.files ? event.target.files[0] : null)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Uploading" : "Upload"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
