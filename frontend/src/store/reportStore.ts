import { create } from "zustand";
import {
  fetchReport,
  fetchReports,
  updateReportStatus,
  uploadReport,
  ReportDetail,
  ReportListItem
} from "../services/reportService";

type ReportState = {
  reports: ReportListItem[];
  current: ReportDetail | null;
  loading: boolean;
  error: string | null;
  loadReports: () => Promise<void>;
  loadReport: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, summary?: string) => Promise<ReportDetail>;
  upload: (formData: FormData) => Promise<void>;
};

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  current: null,
  loading: false,
  error: null,
  loadReports: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchReports();
      set({ reports: data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load reports", loading: false });
    }
  },
  loadReport: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchReport(id);
      set({ current: data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load report", loading: false });
    }
  },
  updateStatus: async (id: string, status: string, summary?: string) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateReportStatus(id, { status, summary });
      set({ current: updated, loading: false });
      return updated;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update report", loading: false });
      throw error;
    }
  },
  upload: async (formData: FormData) => {
    set({ loading: true, error: null });
    try {
      await uploadReport(formData);
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to upload report", loading: false });
      throw error;
    }
  }
}));
