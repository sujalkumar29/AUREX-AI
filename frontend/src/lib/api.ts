const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

class ApiService {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("aurex_token");
  }

  private getHeaders(isFormData: boolean = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...options.headers,
      },
    });

    if (!res.ok) {
      let errorMsg = `API Error (${res.status})`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.detail || errorData.message || errorMsg;
      } catch (e) {
        // use default
      }
      throw new Error(errorMsg);
    }

    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; full_name: string; role?: string; organization_name?: string }) {
    return this.request<{ access_token: string; token_type: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<any>("/auth/me");
  }

  async getSystemStatus() {
    return this.request<{
      ai_engine: string;
      gemini_api_configured: boolean;
      model: string;
      database: string;
      rag_retrieval: string;
      evidence_traceability: string;
    }>("/system-status");
  }

  // Brands
  async listBrands() {
    return this.request<any[]>("/brands");
  }

  async createBrand(data: any) {
    return this.request<any>("/brands", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBrand(id: string, data: any) {
    return this.request<any>(`/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBrand(id: string) {
    return this.request<any>(`/brands/${id}`, {
      method: "DELETE",
    });
  }

  // Brand DNA
  async getBrandDNA(brandId: string) {
    return this.request<any>(`/brand-dna/${brandId}`);
  }

  async addGuideline(brandId: string, data: any) {
    return this.request<any>(`/brand-dna/${brandId}/guidelines`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteGuideline(id: string) {
    return this.request<any>(`/brand-dna/guidelines/${id}`, { method: "DELETE" });
  }

  async addFact(brandId: string, data: any) {
    return this.request<any>(`/brand-dna/${brandId}/facts`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteFact(id: string) {
    return this.request<any>(`/brand-dna/facts/${id}`, { method: "DELETE" });
  }

  async addTerminology(brandId: string, data: any) {
    return this.request<any>(`/brand-dna/${brandId}/terminologies`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteTerminology(id: string) {
    return this.request<any>(`/brand-dna/terminologies/${id}`, { method: "DELETE" });
  }

  async addAsset(brandId: string, data: any) {
    return this.request<any>(`/brand-dna/${brandId}/assets`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteAsset(id: string) {
    return this.request<any>(`/brand-dna/assets/${id}`, { method: "DELETE" });
  }

  // Submissions
  async listSubmissions(brandId?: string, status?: string, search?: string) {
    const params = new URLSearchParams();
    if (brandId) params.append("brand_id", brandId);
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    return this.request<any[]>(`/submissions?${params.toString()}`);
  }

  async getSubmission(id: string) {
    return this.request<any>(`/submissions/${id}`);
  }

  async createSubmission(data: { brand_id: string; title: string; content_type: string; raw_text?: string; file_path?: string; file_url?: string }) {
    return this.request<any>("/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async reanalyzeSubmission(id: string) {
    return this.request<any>(`/submissions/${id}/analyze`, { method: "POST" });
  }

  async reviseSubmission(id: string, data: { raw_text: string; title?: string }) {
    return this.request<any>(`/submissions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Trust Passport
  async getTrustPassport(submissionId: string) {
    return this.request<any>(`/trust-passport/${submissionId}`);
  }

  getTrustPassportPdfUrl(submissionId: string) {
    return `${API_BASE}/trust-passport/${submissionId}/pdf`;
  }

  // Workflow
  async submitReview(data: { submission_id: string; action: string; notes?: string }) {
    return this.request<any>("/workflow/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getReviews(submissionId: string) {
    return this.request<any[]>(`/workflow/reviews/${submissionId}`);
  }

  async addComment(data: { submission_id: string; content: string }) {
    return this.request<any>("/workflow/comments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getComments(submissionId: string) {
    return this.request<any[]>(`/workflow/comments/${submissionId}`);
  }

  async getRevisions(submissionId: string) {
    return this.request<any[]>(`/workflow/revisions/${submissionId}`);
  }

  async getAuditLogs() {
    return this.request<any[]>("/workflow/audit-logs");
  }

  // Insights
  async getInsights() {
    return this.request<any>("/insights");
  }

  // Upload
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<{
      filename: string;
      content_type: string;
      file_path: string;
      file_url: string;
      extracted_text: string;
      image_metadata: any;
    }>("/upload", {
      method: "POST",
      body: formData,
    });
  }
}

export const api = new ApiService();

