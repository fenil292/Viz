export class ApsSettings {
    scheduleAps!: string;
    publishHotsheet!: boolean;
    salesOrderQtyFitTolerancePercent!: number;
    enable!: boolean;
    archivePath!: string;
    datasetPath!: string;
    forceIntegrationDataset!: boolean;
    archiveStorePeriodInDays!: number;
    apsSchedulings!: ApsSchedulings[];
}

export class ApsSchedulings {
    id: number;
    startTime: string;
    finishTime: string;
    status: string;
    createdBy: string;
    logs: string[];
}