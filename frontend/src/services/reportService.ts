import { api } from "./api";
import { get, patch, post } from "./remote";

export type ReportListItem = {
  id: number;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  reportDate: string;
};

export type ReportDetail = {
  id: number;
  name: string;
  type: string;
  status: string;
  summary: string | null;
  filePath: string;
  createdAt: string;
  updatedAt: string;
  reportDate: string;
};

export type StatusUpdatePayload = {
  status: string;
  summary?: string;
};

export type SummaryGeneratePayload = {
  notes?: string;
};

export function fetchReports() {
  return get<ReportListItem[]>(api.reports.root);
}

export function fetchReport(id: string) {
  return get<ReportDetail>(api.reports.detail(id));
}

export function updateReportStatus(id: string, payload: StatusUpdatePayload) {
  return patch<ReportDetail>(api.reports.status(id), JSON.stringify(payload));
}

export function generateReportSummary(id: string, payload?: SummaryGeneratePayload) {
  return post<ReportDetail>(api.reports.summary(id), JSON.stringify(payload || {}));
}

export function uploadReport(formData: FormData) {
  return post<{ id: number; status: string }>(api.reports.root, formData);
}
