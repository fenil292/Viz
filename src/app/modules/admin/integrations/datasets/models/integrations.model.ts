export class Dataset {
    id!: number;
    sessionId!: string;
    status!: string;
    path!: string;
    log!: string;
    apsProcess!: string; 
    processStartedBy!: string;
    createdAt!: string;
}

export class DatasetsData {
    datasets: Dataset[];
    totalItemsCount: number;
}