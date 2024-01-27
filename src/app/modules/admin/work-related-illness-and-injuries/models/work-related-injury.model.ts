export interface WorkRelatedInjuryModel {
  id: number;
  workerName: string;
  jobTitle: string;
  issueDate: string;
  location: string;
  incidentType: string;
  incidentOutcome: string;
  days: number;
  description: string;
  createdAt: string;
}

export interface EntryInitializeDataModel {
  workerNames: string[];
  jobTitles: string[];
  incidentOutcome: any;
  incidentTypes: any;
}
