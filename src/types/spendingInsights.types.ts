export interface Insight {
  id: string;
  title: string;
  body: string;
  categoryId: string | null; // null when the insight isn't tied to a single category
  generatedAt: string; // ISO
}

export interface SpendingInsightsResponse {
  insights: Insight[];
  basedOnMonths: number;
}
