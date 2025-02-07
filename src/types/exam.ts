
export interface PrenatalExam {
  id: string;
  name: string;
  purpose: string;
  possibleResults: string[];
}

export interface ExamRecommendation {
  examId: string;
  patientId: string;
  recommendedDate: string;
  notes?: string;
}
