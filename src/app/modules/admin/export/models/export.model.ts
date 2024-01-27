export class Export {
    id: number;
    changesetId: string
    createdAt: string;
    createdBy: string;
    type: string;
    status: string;
    appliedAt: string | null;
}

export class ExportChangeSet {
    columns: string[];
    rows: Array<string[]>;
}